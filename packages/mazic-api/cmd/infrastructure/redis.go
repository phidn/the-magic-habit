package infrastructure

import (
	"context"
	"fmt"

	"mazic/mazicapi/server/config"

	"github.com/redis/go-redis/v9"
)

type RedisCache struct {
	*redis.Client
}

func NewRedisClient() (rdb *redis.Client) {
	rdb = redis.NewClient(&redis.Options{
		Addr:     config.Config.RedisUri,
		Password: config.Config.RedisPassword,
		DB:       config.Config.RedisDB,
	})

	_, err := rdb.Ping(context.Background()).Result()
	if err != nil {
		fmt.Println("❌ Redis client failed to connect...")
		panic(err)
	}

	fmt.Println("🚀 Successfully connected to redis")
	return
}
