package main

import (
	"github.com/golangthang/mazic-habit/config"
	"github.com/golangthang/mazic-habit/internal/bootstrap"
)

func main() {
	config.Config.LoadConfig()
	bootstrap.Run()
}
