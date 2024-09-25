package role_permission

import (
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
		e.Router.GET("/mz/roles-permissions", route.controller.Find, route.authMiddleware.IsAuthenticated)
		e.Router.PUT("/mz/roles-permissions", route.controller.Update, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
