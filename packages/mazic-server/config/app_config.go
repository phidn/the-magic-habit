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
	Env           string
	IsDevelopment bool
	AppDomain     string
	AppName       string
	BcryptCost    int

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

	SmtpHost       string
	SmtpPort       int
	SmtpUsername   string
	SmtpPassword   string
	SmtpTls        bool
	SmtpLocalName  string
	SmtpSenderName string
	SmtpSenderAddr string

	S3Bucket    string
	S3Region    string
	S3Endpoint  string
	S3AccessKey string
	S3SecretKey string
}

var Config AppConfig

func (config *AppConfig) LoadConfig() error {
	appEnv := os.Getenv("APP_ENV")
	loadAppEnv(appEnv)

	config.Env = appEnv
	config.IsDevelopment = appEnv == "development"
	config.AppDomain = getEnv("APP_DOMAIN", "")
	config.AppName = getEnv("APP_NAME", "The Magic Habit")
	config.BcryptCost = getEnvAsInt("BCRYPT_COST", 10)

	config.SupabaseUrl = getEnv("BCRYPT_COST", "")
	config.SupabaseUrl = getEnv("SUPABASE_URL", "")
	config.SupabaseBucket = getEnv("SUPABASE_BUCKET", "")
	config.SupabaseServiceRole = getEnv("SUPABASE_SERVICE_ROLE", "")

	config.S3Bucket = getEnv("S3_BUCKET", "")
	config.S3Region = getEnv("S3_REGION", "")
	config.S3Endpoint = getEnv("S3_ENDPOINT", "")
	config.S3AccessKey = getEnv("S3_ACCESS", "")
	config.S3SecretKey = getEnv("S3_SECRET", "")

	config.AccessTokenPrivateKey = getEnv("JWT_PRIVATE_KEY", "")
	config.AccessTokenPublicKey = getEnv("JWT_PUBLIC_KEY", "")
	config.RefreshTokenPrivateKey = getEnv("JWT_PRIVATE_KEY", "")
	config.RefreshTokenPublicKey = getEnv("JWT_PUBLIC_KEY", "")
	config.AccessTokenExpiresIn = getEnvAsDuration("ACCESS_TOKEN_EXPIRED_IN", "")   // 1 day
	config.RefreshTokenExpiresIn = getEnvAsDuration("REFRESH_TOKEN_EXPIRED_IN", "") // 7 days

	config.SmtpHost = getEnv("SMTP_HOST", "")
	config.SmtpPort = getEnvAsInt("SMTP_PORT", 587)
	config.SmtpUsername = getEnv("SMTP_USERNAME", "")
	config.SmtpPassword = getEnv("SMTP_PASSWORD", "")
	config.SmtpTls = getEnvAsBool("SMTP_TLS", false)
	config.SmtpLocalName = getEnv("SMTP_LOCAL_NAME", "")
	config.SmtpSenderName = getEnv("SMTP_SENDER_NAME", "")
	config.SmtpSenderAddr = getEnv("SMTP_SENDER_ADDR", "")

	return nil
}

func loadAppEnv(appEnv string) {
	envFile := ".env"
	if appEnv != "" {
		envFile = fmt.Sprintf(".env.%s", appEnv)
	}
	if err := godotenv.Load(envFile); err != nil {
		log.Fatalf("Error loading %s file: %v", envFile, err)
	}
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

func getEnvAsBool(name string, defaultVal bool) bool {
	valueStr := getEnv(name, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultVal
}
