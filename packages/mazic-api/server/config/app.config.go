package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	Env        string
	ApiVersion string
	Port       string
	JwtSecret  string

	DbHost     string
	DbUser     string
	DbPassword string
	DbPort     string
	DbName     string

	SupabaseUrl         string
	SupabaseBucket      string
	SupabaseToken       string
	SupabaseSecret      string
	SupabaseServiceRole string

	RedisUri      string
	RedisPassword string
	RedisDB       int

	AccessTokenPrivateKey  string
	AccessTokenPublicKey   string
	RefreshTokenPrivateKey string
	RefreshTokenPublicKey  string
	AccessTokenExpiresIn   time.Duration
	RefreshTokenExpiresIn  time.Duration
}

var Config AppConfig

func (config *AppConfig) LoadConfig() error {
	goEnv := os.Getenv("GO_ENV")
	customEnv := ".env"
	if goEnv != "" {
		customEnv = fmt.Sprintf(".env.%s", goEnv)
	}

	if err := godotenv.Load(customEnv); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	config.ApiVersion = getEnv("API_VERSION", "1.0")
	config.Port = getEnv("PORT", "8080")
	config.JwtSecret = getEnv("JWT_SECRET", "defaultSecret")
	config.Env = goEnv

	config.DbHost = getEnv("DB_HOST", "localhost")
	config.DbPort = getEnv("DB_PORT", "5432")
	config.DbUser = getEnv("DB_USER", "user")
	config.DbPassword = getEnv("DB_PASSWORD", "password")
	config.DbName = getEnv("DB_NAME", "dbname")

	config.SupabaseUrl = getEnv("SUPABASE_URL", "")
	config.SupabaseBucket = getEnv("SUPABASE_BUCKET", "")
	config.SupabaseServiceRole = getEnv("SUPABASE_SERVICE_ROLE", "")

	config.RedisUri = getEnv("REDIS_URI", "redis://localhost:6379")
	config.RedisPassword = getEnv("REDIS_PASSWORD", "")
	config.RedisDB = getEnvAsInt("RedisDB", 0)

	config.AccessTokenPrivateKey = getEnv("ACCESS_TOKEN_PRIVATE_KEY", "")
	config.AccessTokenPublicKey = getEnv("ACCESS_TOKEN_PUBLIC_KEY", "")
	config.RefreshTokenPrivateKey = getEnv("REFRESH_TOKEN_PRIVATE_KEY", "")
	config.RefreshTokenPublicKey = getEnv("REFRESH_TOKEN_PUBLIC_KEY", "")
	config.AccessTokenExpiresIn = getEnvAsDuration("ACCESS_TOKEN_EXPIRED_IN", "15m")
	config.RefreshTokenExpiresIn = getEnvAsDuration("REFRESH_TOKEN_EXPIRED_IN", "7d")

	return nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvAsInt(name string, defaultVal int) int {
	valueStr := getEnv(name, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}

func getEnvAsDuration(name string, defaultVal string) time.Duration {
	valueStr := getEnv(name, defaultVal)
	if value, err := time.ParseDuration(valueStr); err == nil {
		return value
	}
	return time.Duration(0)
}
