package role_permission

import (
	"mazic/server/config"
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type RolePermissionRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *RolePermissionController
}

func NewRolePermissionRoute(app *infrastructure.Pocket, controller *RolePermissionController, authMiddleware *middlewares.AuthMiddleware) *RolePermissionRoute {
	return &RolePermissionRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *RolePermissionRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		r := e.Router.Group("/mz/roles-permissions")
		r.Use(route.authMiddleware.IsAuthenticated)

		allActionsCode := config.Config.Shared.Permissions.Administration.AllActions
		r.Use(route.authMiddleware.HasPermissions(allActionsCode))

		r.GET("", route.controller.Find)
		r.PUT("", route.controller.Update)
		return nil
	})
}
