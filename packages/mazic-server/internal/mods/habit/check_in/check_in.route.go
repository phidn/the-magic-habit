package check_in

import (
	"github.com/golangthang/mazic-habit/config"
	middlewares "github.com/golangthang/mazic-habit/internal/middlewares"
	"github.com/golangthang/mazic-habit/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type CheckInRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *CheckInController
}

func NewCheckInRoute(app *infrastructure.Pocket, controller *CheckInController, authMiddleware *middlewares.AuthMiddleware) *CheckInRoute {
	return &CheckInRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *CheckInRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		r := e.Router.Group("/mz/check-in")

		r.Use(route.authMiddleware.IsAuthenticated)
		checkInCodes := config.Config.Shared.Permissions.HabitCheckIn

		r.POST("", route.controller.CheckIn, route.authMiddleware.HasPermissions(checkInCodes.Save))
		r.DELETE("/:id", route.controller.DeleteCheckIn, route.authMiddleware.HasPermissions(checkInCodes.Delete))

		return nil
	})
}
