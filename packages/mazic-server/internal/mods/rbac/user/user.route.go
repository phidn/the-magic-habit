package user

import (
	"github.com/golangthang/mazic-habit/config"
	middlewares "github.com/golangthang/mazic-habit/internal/middlewares"
	"github.com/golangthang/mazic-habit/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type UserRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *UserController
}

func NewUserRoute(app *infrastructure.Pocket, controller *UserController, authMiddleware *middlewares.AuthMiddleware) *UserRoute {
	return &UserRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *UserRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		r := e.Router.Group("/mz/users")
		r.Use(route.authMiddleware.IsAuthenticated)
		r.PUT("/profile", route.controller.UpdateProfile)

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
