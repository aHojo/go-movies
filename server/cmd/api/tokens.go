package main

import (
	"backend/models"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
)

// dummy user to test. This would usually be handled by a database.
var validUser = models.User{
	ID:       10,
	Email:    "me@here.com",
	Password: "$2a$12$5RyXYISQ6DKsGyg/v9EwTOYfBcqj6ruRvAmG9x5vnOoxluHVdp06i", // grabbed from https://play.golang.org/p/uKMMCzJWGsW
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (app *application) Signin(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		app.errorJSON(w, errors.New("Unauthorized"))
		return
	}

	hashedPassword := validUser.Password

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password))
	if err != nil {
		app.errorJSON(w, errors.New("Unauthorized"))
		return
	}

	var claims jwt.Claims
	claims.Subject = fmt.Sprintf("%d", validUser.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(time.Hour * 24))
	claims.Issuer = "mydomain.com"
	claims.Audiences = []string{"mydomain.come"}

	jwtBytes,err := claims.HMACSign(jwt.HS256, []byte(app.config.jwt.secret))
	if err != nil {
		app.errorJSON(w, errors.New("error signing the jwt"))
		return
	}
	app.writeJSON(w, http.StatusOK, jwtBytes, "jwt")

}
