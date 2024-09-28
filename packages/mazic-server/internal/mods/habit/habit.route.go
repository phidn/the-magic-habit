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
		e.Router.GET("/mz/habits", route.controller.Find, route.authMiddleware.IsAuthenticated)
		e.Router.GET("/mz/habits/:id", route.controller.GetById, route.authMiddleware.IsAuthenticated)
		e.Router.POST("/mz/habits", route.controller.Create, route.authMiddleware.IsAuthenticated)
		e.Router.PUT("/mz/habits/:id", route.controller.Update, route.authMiddleware.IsAuthenticated)
		e.Router.DELETE("/mz/habits/:id", route.controller.Delete, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
