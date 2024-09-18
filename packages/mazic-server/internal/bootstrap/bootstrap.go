package bootstrap

import (
	"context"
	"log"
	"mazic/server/internal/mods"
	"mazic/server/pkg/infrastructure"

	"go.uber.org/fx"
)

func Run() {
	app := fx.New(
		mods.Modules,
		infrastructure.Modules,
		// fx.NopLogger,
	)
	if err := app.Start(context.Background()); err != nil {
		log.Fatal(err)
	}
	defer app.Stop(context.Background())
}
