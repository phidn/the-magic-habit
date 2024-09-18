package main

import (
	"fmt"
	"log"
	"mazic/server/internal/bootstrap"
	"os"

	"github.com/joho/godotenv"
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

	bootstrap.Run()
}
