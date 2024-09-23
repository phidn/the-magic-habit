package mods

import (
	"mazic/server/internal/mods/auth"
	"mazic/server/internal/mods/global"
	"mazic/server/internal/mods/rbac/action"
	"mazic/server/internal/mods/rbac/permission"
	"mazic/server/internal/mods/rbac/resource"
	"mazic/server/internal/mods/rbac/role"
	"mazic/server/internal/mods/rbac/user"

	"go.uber.org/fx"
)

var Modules = fx.Options(
	fx.Module("global",
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
		)),

	fx.Module("auth", fx.Options(
		fx.Provide(
			auth.NewAuthService,
			auth.NewAuthController,
			auth.NewAuthRoute,
		),
		fx.Invoke(func(auth *auth.AuthRoute) error {
			auth.SetupRoutes()
			return nil
		}),
	)),

	fx.Module("user", fx.Options(
		fx.Provide(
			user.NewUserService,
			user.NewUserController,
			user.NewUserRoute,
		),
		fx.Invoke(func(user *user.UserRoute) error {
			user.SetupRoutes()
			return nil
		}),
	)),

	fx.Module("role", fx.Options(
		fx.Provide(
			role.NewRoleService,
			role.NewRoleController,
			role.NewRoleRoute,
		),
		fx.Invoke(func(role *role.RoleRoute) error {
			role.SetupRoutes()
			return nil
		}),
	)),
	fx.Module("resource", fx.Options(
		fx.Provide(
			resource.NewResourceService,
			resource.NewResourceController,
			resource.NewResourceRoute,
		),
		fx.Invoke(func(resource *resource.ResourceRoute) error {
			resource.SetupRoutes()
			return nil
		}),
	)),
	fx.Module("permission", fx.Options(
		fx.Provide(
			permission.NewPermissionService,
			permission.NewPermissionController,
			permission.NewPermissionRoute,
		),
		fx.Invoke(func(permission *permission.PermissionRoute) error {
			permission.SetupRoutes()
			return nil
		}),
	)),
	fx.Module("action", fx.Options(
		fx.Provide(
			action.NewActionService,
			action.NewActionController,
			action.NewActionRoute,
		),
		fx.Invoke(func(action *action.ActionRoute) error {
			action.SetupRoutes()
			return nil
		}),
	)),
)
