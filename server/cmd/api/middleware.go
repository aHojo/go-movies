package main

import "net/http"

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
