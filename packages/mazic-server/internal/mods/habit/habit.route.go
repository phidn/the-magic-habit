package habit

import (
	"mazic/server/config"
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

		habitCodes := config.Config.Shared.Permissions.Habit
		checkInCodes := config.Config.Shared.Permissions.HabitCheckIn

		r.GET("", route.controller.Find, route.authMiddleware.HasPermissions(habitCodes.View))
		r.GET("/:id", route.controller.FindOne, route.authMiddleware.HasPermissions(habitCodes.View))
		r.POST("", route.controller.Create, route.authMiddleware.HasPermissions(habitCodes.Create))
		r.PUT("/:id", route.controller.Update, route.authMiddleware.HasPermissions(habitCodes.Update))
		r.DELETE("/:id", route.controller.Delete, route.authMiddleware.HasPermissions(habitCodes.Delete))
		r.POST("/check-in", route.controller.CheckIn, route.authMiddleware.HasPermissions(checkInCodes.Save))
		r.DELETE("/check-in/:id", route.controller.DeleteCheckIn, route.authMiddleware.HasPermissions(checkInCodes.Delete))

		return nil
	})
}
