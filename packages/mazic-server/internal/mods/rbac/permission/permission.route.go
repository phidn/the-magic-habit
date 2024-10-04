package permission

import (
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
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
		r := e.Router.Group("/mz/permissions")
		r.Use(route.authMiddleware.IsAuthenticated)
		r.Use(route.authMiddleware.HasPermissions("administration.all_actions"))

		r.GET("", route.controller.Find)
		r.GET("/:id", route.controller.GetById)
		r.POST("", route.controller.Create)
		r.PUT("/:id", route.controller.Update)
		r.DELETE("/:id", route.controller.Delete)
		r.POST("/delete", route.controller.BulkDelete)
		r.POST("/seed", route.controller.Seed)
		return nil
	})
}
