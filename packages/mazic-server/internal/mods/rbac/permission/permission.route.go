package permission

import (
	"mazic/pocketbase/core"
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"
)

type PermissionRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *PermissionController
}

func NewPermissionRoute(app *infrastructure.Pocket, controller *PermissionController, authMiddleware *middlewares.AuthMiddleware) *PermissionRoute {
	return &PermissionRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *PermissionRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/mz/permissions", route.controller.Find, route.authMiddleware.IsAuthenticated)
		e.Router.GET("/mz/permissions/:id", route.controller.GetById, route.authMiddleware.IsAuthenticated)
		e.Router.POST("/mz/permissions", route.controller.Create, route.authMiddleware.IsAuthenticated)
		e.Router.PUT("/mz/permissions/:id", route.controller.Update, route.authMiddleware.IsAuthenticated)
		e.Router.DELETE("/mz/permissions/:id", route.controller.Delete, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
