package bootstrap

import (
	"context"
	"log"

	middleware "github.com/golangthang/mazic-habit/internal/middlewares"
	"github.com/golangthang/mazic-habit/internal/mods"
	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/infrastructure"

	"go.uber.org/fx"
)

func Run() {
	app := fx.New(
		mods.Modules,
		infrastructure.Modules,
		entry.Module,
		middleware.Modules,
		fx.NopLogger,
	)
	if err := app.Start(context.Background()); err != nil {
		log.Fatal(err)
	}
	defer app.Stop(context.Background())
}
