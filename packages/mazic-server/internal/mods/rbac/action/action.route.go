package action

import (
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type ActionRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *ActionController
}

func NewActionRoute(app *infrastructure.Pocket, controller *ActionController, authMiddleware *middlewares.AuthMiddleware) *ActionRoute {
	return &ActionRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *ActionRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/mz/actions", route.controller.Find, route.authMiddleware.IsAuthenticated)
		e.Router.GET("/mz/actions/:id", route.controller.GetById, route.authMiddleware.IsAuthenticated)
		e.Router.POST("/mz/actions", route.controller.Create, route.authMiddleware.IsAuthenticated)
		e.Router.PUT("/mz/actions/:id", route.controller.Update, route.authMiddleware.IsAuthenticated)
		e.Router.DELETE("/mz/actions/:id", route.controller.Delete, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
