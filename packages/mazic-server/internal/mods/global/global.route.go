package global

import (
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type GlobalRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *GlobalController
}

func NewGlobalRoute(app *infrastructure.Pocket, controller *GlobalController, authMiddleware *middlewares.AuthMiddleware) *GlobalRoute {
	return &GlobalRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *GlobalRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/mz/global/options", route.controller.ListOptions, route.authMiddleware.IsAuthenticated)
		e.Router.POST("/mz/global/upload", route.controller.Upload, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
