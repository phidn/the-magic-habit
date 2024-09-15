package mods

import (
	"mazic/mazicapi/mods/master_data/close_reason"
	"mazic/mazicapi/mods/rbac/action"
	"mazic/mazicapi/mods/rbac/auth"
	"mazic/mazicapi/mods/rbac/permission"
	"mazic/mazicapi/mods/rbac/resource"
	"mazic/mazicapi/mods/rbac/role"
	"mazic/mazicapi/mods/rbac/role_permission"
	"mazic/mazicapi/mods/rbac/user"

	"go.uber.org/fx"
)

var Module = fx.Options(fx.Provide(
	resource.NewResourceController,
	resource.NewResourceService,

	permission.NewPermissionController,
	permission.NewPermissionService,
	permission.NewPermissionRepository,

	action.NewActionController,
	action.NewActionService,

	role.NewRoleController,
	role.NewRoleService,

	role_permission.NewRolePermissionController,
	role_permission.NewRolePermissionService,

	user.NewUserController,
	user.NewUserService,
	user.NewUserRepository,

	auth.NewAuthController,
	auth.NewAuthService,
	auth.NewAuthRepository,

	close_reason.NewCloseReasonController,
	close_reason.NewCloseReasonService,
))
