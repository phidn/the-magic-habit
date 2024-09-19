package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	Env string

	SupabaseUrl         string
	SupabaseBucket      string
	SupabaseToken       string
	SupabaseSecret      string
	SupabaseServiceRole string

	AccessTokenPrivateKey  string
	AccessTokenPublicKey   string
	RefreshTokenPrivateKey string
	RefreshTokenPublicKey  string
	AccessTokenExpiresIn   time.Duration
	RefreshTokenExpiresIn  time.Duration
}

var Config AppConfig

func (config *AppConfig) LoadConfig() error {
	goEnv := os.Getenv("APP_ENV")
	envFile := ".env"
	if goEnv != "" {
		envFile = fmt.Sprintf(".env.%s", goEnv)
	}
	if err := godotenv.Load(envFile); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	config.Env = goEnv

	config.SupabaseUrl = getEnv("SUPABASE_URL", "")
	config.SupabaseBucket = getEnv("SUPABASE_BUCKET", "")
	config.SupabaseServiceRole = getEnv("SUPABASE_SERVICE_ROLE", "")

	config.AccessTokenPrivateKey = getEnv("JWT_PRIVATE_KEY", "")
	config.AccessTokenPublicKey = getEnv("JWT_PUBLIC_KEY", "")
	config.RefreshTokenPrivateKey = getEnv("JWT_PRIVATE_KEY", "")
	config.RefreshTokenPublicKey = getEnv("JWT_PUBLIC_KEY", "")
	config.AccessTokenExpiresIn = getEnvAsDuration("ACCESS_TOKEN_EXPIRED_IN", "24h")    // 1 day
	config.RefreshTokenExpiresIn = getEnvAsDuration("REFRESH_TOKEN_EXPIRED_IN", "168h") // 7 days

	return nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvAsDuration(name string, defaultVal string) time.Duration {
	valueStr := getEnv(name, defaultVal)
	if value, err := time.ParseDuration(valueStr); err == nil {
		return value
	}
	return time.Duration(0)
}
