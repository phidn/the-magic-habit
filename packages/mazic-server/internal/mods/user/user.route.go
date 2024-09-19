package user

import (
	"mazic/pocketbase/core"
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"
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
		e.Router.GET("/mz/users", route.controller.GetUsers, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
