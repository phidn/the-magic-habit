package main

import (
	"fmt"
	"log"
	"mazic/pocketbase"
	"mazic/pocketbase/core"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v5"
)

func main() {
	goEnv := os.Getenv("GO_ENV")
	envFile := ".env"
	if goEnv != "" {
		envFile = fmt.Sprintf(".env.%s", goEnv)
	}

	if err := godotenv.Load(envFile); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {

		e.Router.POST("/mazic/auth/login", func(c echo.Context) error {
			return c.JSON(http.StatusOK, map[string]string{"message": "Hello"})
		})

		// e.Router.POST("/auth/login", auth.Login)
		// e.Router.POST("/auth/logout", auth.Logout)
		// e.Router.POST("/auth/register", auth.Register)
		// e.Router.POST("/auth/refresh-token", auth.RefreshToken)
		// e.Router.GET("/auth/me", auth.GetMe)

		// e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
