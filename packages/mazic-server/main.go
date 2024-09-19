package main

import (
	"mazic/server/config"
	"mazic/server/internal/bootstrap"
)

func main() {
	config.Config.LoadConfig()
	bootstrap.Run()
}
