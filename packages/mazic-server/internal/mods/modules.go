package mods

import (
	"mazic/server/internal/mods/auth"
	"mazic/server/internal/mods/user"

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
var userModule = fx.Module("user",
	fx.Options(
		fx.Provide(
			user.NewUserService,
			user.NewUserController,
			user.NewUserRoute,
		),
		fx.Invoke(func(user *user.UserRoute) error {
			user.SetupRoutes()
			return nil
		}),
	))

var Modules = fx.Options(
	authModule,
	userModule,
)
