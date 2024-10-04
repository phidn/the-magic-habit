package resource

import (
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
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
		r := e.Router.Group("/mz/resources")
		r.Use(route.authMiddleware.IsAuthenticated)
		r.Use(route.authMiddleware.HasPermissions("administration.all_actions"))

		r.GET("", route.controller.Find)
		r.GET("/:id", route.controller.GetById)
		r.POST("", route.controller.Create)
		r.PUT("/:id", route.controller.Update)
		r.DELETE("/:id", route.controller.Delete)
		return nil
	})
}
