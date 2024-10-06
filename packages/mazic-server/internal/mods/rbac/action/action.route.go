package action

import (
	"mazic/server/config"
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
		r := e.Router.Group("/mz/actions")
		r.Use(route.authMiddleware.IsAuthenticated)

		allActionsCode := config.Config.Shared.Permissions.Administration.AllActions
		r.Use(route.authMiddleware.HasPermissions(allActionsCode))

		r.GET("", route.controller.Find)
		r.GET("/:id", route.controller.GetById)
		r.POST("", route.controller.Create)
		r.PUT("/:id", route.controller.Update)
		r.DELETE("/:id", route.controller.Delete)
		return nil
	})
}
