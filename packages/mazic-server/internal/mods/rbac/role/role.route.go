package role

import (
	"mazic/pocketbase/core"
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"
)

type RoleRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *RoleController
}

func NewRoleRoute(app *infrastructure.Pocket, controller *RoleController, authMiddleware *middlewares.AuthMiddleware) *RoleRoute {
	return &RoleRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *RoleRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/mz/roles", route.controller.Find, route.authMiddleware.IsAuthenticated)
		e.Router.GET("/mz/roles/:id", route.controller.GetById, route.authMiddleware.IsAuthenticated)
		e.Router.POST("/mz/roles", route.controller.Create, route.authMiddleware.IsAuthenticated)
		e.Router.PUT("/mz/roles/:id", route.controller.Update, route.authMiddleware.IsAuthenticated)
		e.Router.DELETE("/mz/roles/:id", route.controller.Delete, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
