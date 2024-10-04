package habit

import (
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

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
		r.Use(route.authMiddleware.IsAuthenticated)

		r.GET("", route.controller.Find, route.authMiddleware.HasPermissions("habit.view"))
		r.GET("/:id", route.controller.GetById, route.authMiddleware.HasPermissions("habit.view"))
		r.POST("", route.controller.Create, route.authMiddleware.HasPermissions("habit.create"))
		r.PUT("/:id", route.controller.Update, route.authMiddleware.HasPermissions("habit.update"))
		r.DELETE("/:id", route.controller.Delete, route.authMiddleware.HasPermissions("habit.delete"))
		r.POST("/check-in", route.controller.CheckIn, route.authMiddleware.HasPermissions("habit_check_in.save"))
		r.DELETE("/check-in/:id", route.controller.DeleteCheckIn, route.authMiddleware.HasPermissions("habit_check_in.delete"))
		return nil
	})
}
