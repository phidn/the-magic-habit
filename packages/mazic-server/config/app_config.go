package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	shared "github.com/golangthang/mazic-habit/shared/src/config"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	Env           string
	IsDevelopment bool

	Shared shared.Config

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

	BcryptCost int
}

var Config AppConfig

func (config *AppConfig) LoadConfig() error {
	appEnv := os.Getenv("APP_ENV")
	envFile := ".env"
	if appEnv != "" {
		envFile = fmt.Sprintf(".env.%s", appEnv)
	}
	if err := godotenv.Load(envFile); err != nil {
		log.Fatalf("Error loading %s file: %v", envFile, err)
	}

	config.Env = appEnv
	config.IsDevelopment = appEnv == "development"

	if err := config.Shared.LoadConfig(); err != nil {
		log.Fatalf("Failed to load shared config: %v", err)
	}

	config.SupabaseUrl = getEnv("BCRYPT_COST", "")
	config.SupabaseUrl = getEnv("SUPABASE_URL", "")
	config.SupabaseBucket = getEnv("SUPABASE_BUCKET", "")
	config.SupabaseServiceRole = getEnv("SUPABASE_SERVICE_ROLE", "")

	config.AccessTokenPrivateKey = getEnv("JWT_PRIVATE_KEY", "")
	config.AccessTokenPublicKey = getEnv("JWT_PUBLIC_KEY", "")
	config.RefreshTokenPrivateKey = getEnv("JWT_PRIVATE_KEY", "")
	config.RefreshTokenPublicKey = getEnv("JWT_PUBLIC_KEY", "")
	config.AccessTokenExpiresIn = getEnvAsDuration("ACCESS_TOKEN_EXPIRED_IN", "24h")    // 1 day
	config.RefreshTokenExpiresIn = getEnvAsDuration("REFRESH_TOKEN_EXPIRED_IN", "168h") // 7 days

	config.BcryptCost = getEnvAsInt("BCRYPT_COST", 10)

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

func getEnvAsInt(name string, defaultVal int) int {
	valueStr := getEnv(name, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}
