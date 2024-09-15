package main

import (
	"context"

	"mazic/mazicapi/cmd/infrastructure"
	"mazic/mazicapi/common"
	"mazic/mazicapi/mods"
	"mazic/mazicapi/server"
	"mazic/mazicapi/server/middleware"
	"mazic/mazicapi/server/router"

	"go.uber.org/fx"

	_ "github.com/lib/pq"
)

func main() {
	app := fx.New(
		fx.Provide(server.NewServer),
		router.Module,
		middleware.Module,
		common.Module,
		mods.Module,
		infrastructure.Module,
		fx.NopLogger,
	)

	ctx := context.Background()
	defer app.Stop(ctx)

	if err := app.Start(ctx); err != nil {
		panic(err)
	}

	// Block main goroutine to prevent exit
	select {}
}
