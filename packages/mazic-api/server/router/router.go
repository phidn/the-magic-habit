package router

import (
	entry_common "mazic/mazicapi/common/entry"
	_ "mazic/mazicapi/docs"
	"mazic/mazicapi/server"
	"mazic/mazicapi/server/middleware"

	"mazic/mazicapi/mods/master_data/close_reason"
	"mazic/mazicapi/mods/rbac/action"
	"mazic/mazicapi/mods/rbac/auth"
	"mazic/mazicapi/mods/rbac/permission"
	"mazic/mazicapi/mods/rbac/resource"
	"mazic/mazicapi/mods/rbac/role"
	"mazic/mazicapi/mods/rbac/role_permission"
	"mazic/mazicapi/mods/rbac/user"

	echoMiddleware "github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	"go.uber.org/fx"
)

var Module = fx.Options(fx.Invoke(NewRoute))

type Route struct {
	*server.Server
	middleware               *middleware.Middleware
	entryController          *entry_common.EntryController
	resourceController       *resource.ResourceController
	actionController         *action.ActionController
	permissionController     *permission.PermissionController
	roleController           *role.RoleController
	rolePermissionController *role_permission.RolePermissionController
	userController           *user.UserController
	authController           *auth.AuthController
	closeReasonController    *close_reason.CloseReasonController
}

func NewRoute(
	server *server.Server,
	middleware *middleware.Middleware,
	entryController *entry_common.EntryController,
	resourceController *resource.ResourceController,
	actionController *action.ActionController,
	permissionController *permission.PermissionController,
	roleController *role.RoleController,
	rolePermissionController *role_permission.RolePermissionController,
	userController *user.UserController,
	authController *auth.AuthController,
	closeReasonController *close_reason.CloseReasonController,
) *Route {
	e := server.Echo
	e.Use(echoMiddleware.Logger())
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	v1 := e.Group("/api/v1")

	// Modular routes
	auth.AuthRoute(v1, middleware, authController)
	user.UserRoute(v1, middleware, userController)
	permission.PermissionRoute(v1, middleware, permissionController)
	action.ActionRoute(v1, middleware, actionController)
	resource.ResourceRoute(v1, middleware, resourceController)
	role.RoleRoute(v1, middleware, roleController)
	role_permission.RolePermissionRoute(v1, middleware, rolePermissionController)
	close_reason.CloseReasonRoute(v1, middleware, closeReasonController)
	entry_common.EntryRoute(v1, middleware, entryController)

	return &Route{
		server,
		middleware,
		entryController,
		resourceController,
		actionController,
		permissionController,
		roleController,
		rolePermissionController,
		userController,
		authController,
		closeReasonController,
	}
}
