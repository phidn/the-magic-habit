package habit

import (
	middlewares "github.com/golangthang/mazic-habit/internal/middlewares"
	"github.com/golangthang/mazic-habit/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type HabitRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *HabitController
}

func NewHabitRoute(app *infrastructure.Pocket, controller *HabitController, authMiddleware *middlewares.AuthMiddleware) *HabitRoute {
	return &HabitRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *HabitRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		r := e.Router.Group("/mz/habits")
		r.GET("/widget/:api_key", route.controller.FindWidget)

		r.Use(route.authMiddleware.IsAuthenticated)

		r.GET("", route.controller.Find, route.authMiddleware.HasPermissions("habit.view"))
		r.GET("/:id", route.controller.FindOne, route.authMiddleware.HasPermissions("habit.view"))
		r.POST("", route.controller.Create, route.authMiddleware.HasPermissions("habit.create"))
		r.PUT("/:id", route.controller.Update, route.authMiddleware.HasPermissions("habit.update"))
		r.DELETE("/:id", route.controller.Delete, route.authMiddleware.HasPermissions("habit.delete"))

		return nil
	})
}
