package main

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/pascaldekloe/jwt"
)

func (app *application) enableCORS(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		/*
			Add this because the header is dynamic
		*/
		w.Header().Add("Vary", "Origin")

		// This is for the preflight cors request
		w.Header().Add("Vary", "Access-Control-Request-Method")

		w.Header().Set("Access-Control-Allow-Origin", "*")

		// check if the request has the HTTP method OPTIONS and contains the
		// "Access-Control-Request-Method" header.
		// If it does, treat it as a preflight request
		if r.Method == http.MethodOptions && r.Header.Get("Access-Control-Request-Method") != "" {
			// Set the necessary preflight response headers
			w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, PUT, PATCH, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

			// Write the headers along with a 200 OK status and return from the middleware with no further action.
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (app *application) checkToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			// could set an anonymous user here
			app.errorJSON(w, errors.New("no auth header provided"))
		}

		headerParts := strings.Split(authHeader, " ")
		if len(headerParts) != 2 || strings.ToLower(headerParts[0]) != "bearer" {
			app.errorJSON(w, errors.New("invalid authorization header"))
			return
		}

		token := headerParts[1]
		claims, err := jwt.HMACCheck([]byte(token), []byte(app.config.jwt.secret))
		if err != nil {
			app.errorJSON(w, err, http.StatusForbidden)
			return
		}

		if !claims.Valid(time.Now()) {
			app.errorJSON(w, errors.New("invalid token"),http.StatusForbidden)
			return
		}

		if !claims.AcceptAudience("mydomain.com") {
			app.errorJSON(w, errors.New("invalid audience"),http.StatusForbidden)
			return
		}

		if claims.Issuer != "mydomain.com" {
			app.errorJSON(w, errors.New("invalid issuer"), http.StatusForbidden)
			return
		}

		userID, err := strconv.ParseInt(claims.Subject, 10, 64)
		if err != nil {
			app.errorJSON(w, err, http.StatusForbidden)
			return
		}

		log.Println("Valid user: ", userID)


		next.ServeHTTP(w, r)
	})
}
