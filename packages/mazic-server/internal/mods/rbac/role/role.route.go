package role

import (
	"mazic/server/config"
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
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
		r := e.Router.Group("/mz/roles")
		r.Use(route.authMiddleware.IsAuthenticated)

		allActionsCode := config.Config.Shared.Permissions.Administration.AllActions
		r.Use(route.authMiddleware.HasPermissions(allActionsCode))

		r.GET("", route.controller.Find)
		r.GET("/:id", route.controller.GetById)
		r.POST("", route.controller.Create)
		r.PUT(":/id", route.controller.Update)
		r.DELETE("/:id", route.controller.Delete)
		return nil
	})
}
