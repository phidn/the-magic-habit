package mods

import (
	"mazic/server/internal/mods/auth"

	"go.uber.org/fx"
)

var authModule = fx.Module("auth",
	fx.Options(
		fx.Provide(
			auth.NewAuthService,
			auth.NewAuthController,
			auth.NewAuthRoute,
		),
		fx.Invoke(func(auth *auth.AuthRoute) error {
			auth.SetupRoutes()
			return nil
		}),
	))

var Modules = fx.Options(
	authModule,
)
