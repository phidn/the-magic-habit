package mods

import (
	"mazic/server/internal/mods/auth"
	"mazic/server/internal/mods/global"
	"mazic/server/internal/mods/rbac/user"

	"go.uber.org/fx"
)

var globalModule = fx.Module("global",
	fx.Options(
		fx.Provide(
			global.NewGlobalService,
			global.NewGlobalController,
			global.NewGlobalRoute,
		),
		fx.Invoke(func(global *global.GlobalRoute) error {
			global.SetupRoutes()
			return nil
		}),
	))

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
	globalModule,
	userModule,
)
