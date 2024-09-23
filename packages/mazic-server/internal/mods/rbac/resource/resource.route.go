package resource

import (
	"mazic/pocketbase/core"
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"
)

type ResourceRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *ResourceController
}

func NewResourceRoute(app *infrastructure.Pocket, controller *ResourceController, authMiddleware *middlewares.AuthMiddleware) *ResourceRoute {
	return &ResourceRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *ResourceRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/mz/resources", route.controller.Find, route.authMiddleware.IsAuthenticated)
		e.Router.GET("/mz/resources/:id", route.controller.GetById, route.authMiddleware.IsAuthenticated)
		e.Router.POST("/mz/resources", route.controller.Create, route.authMiddleware.IsAuthenticated)
		e.Router.PUT("/mz/resources/:id", route.controller.Update, route.authMiddleware.IsAuthenticated)
		e.Router.DELETE("/mz/resources/:id", route.controller.Delete, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
