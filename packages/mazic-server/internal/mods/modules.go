package mods

import (
	"github.com/golangthang/mazic-habit/internal/mods/global"
	"github.com/golangthang/mazic-habit/internal/mods/habit/check_in"
	"github.com/golangthang/mazic-habit/internal/mods/habit/habit"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/action"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/auth"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/permission"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/resource"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/role"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/role_permission"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/user"

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
	fx.Module("role_permission", fx.Options(
		fx.Provide(
			role_permission.NewRolePermissionService,
			role_permission.NewRolePermissionController,
			role_permission.NewRolePermissionRoute,
		),
		fx.Invoke(func(role_permission *role_permission.RolePermissionRoute) error {
			role_permission.SetupRoutes()
			return nil
		}),
	)),
	fx.Module("habit", fx.Options(
		fx.Provide(
			habit.NewHabitService,
			habit.NewHabitController,
			habit.NewHabitRoute,
		),
		fx.Invoke(func(habit *habit.HabitRoute) error {
			habit.SetupRoutes()
			return nil
		}),
	)),
	fx.Module("check_in", fx.Options(
		fx.Provide(
			check_in.NewCheckInService,
			check_in.NewCheckInController,
			check_in.NewCheckInRoute,
		),
		fx.Invoke(func(check_in *check_in.CheckInRoute) error {
			check_in.SetupRoutes()
			return nil
		}),
	)),
)
