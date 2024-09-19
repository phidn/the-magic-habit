package token

import (
	"errors"

	"github.com/golang-jwt/jwt/v4"
)

func CreateToken(privateKey string, payload jwt.MapClaims) (string, error) {
	rsaKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(privateKey))
	if err != nil {
		return "", err
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodRS256, payload).SignedString(rsaKey)
	if err != nil {
		return "", err
	}

	return token, nil
}

func ValidateToken(token string, publicKey string) (jwt.MapClaims, error) {
	rsaKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey))
	if err != nil {
		return nil, err
	}

	parser := jwt.NewParser(jwt.WithValidMethods([]string{"RS256"}))
	parsedToken, err := parser.Parse(token, func(t *jwt.Token) (any, error) {
		return rsaKey, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok && parsedToken.Valid {
		return claims, nil
	}

	return nil, errors.New("unable to parse token")
}
