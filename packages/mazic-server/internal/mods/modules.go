package mods

import (
	"mazic/server/internal/mods/auth"

	"go.uber.org/fx"
)

var Modules = fx.Options(
	fx.Provide(auth.NewAuth),
	fx.Invoke(func(auth *auth.Auth) error {
		auth.SetupRoutes()
		return nil
	}),
)
