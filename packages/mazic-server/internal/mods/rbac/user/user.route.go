package user

import (
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

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
		e.Router.GET("/mz/users", route.controller.Find, route.authMiddleware.IsAuthenticated)
		e.Router.GET("/mz/users/:id", route.controller.GetById, route.authMiddleware.IsAuthenticated)
		e.Router.POST("/mz/users", route.controller.Create, route.authMiddleware.IsAuthenticated)
		e.Router.PUT("/mz/users/:id", route.controller.Update, route.authMiddleware.IsAuthenticated)
		e.Router.DELETE("/mz/users/:id", route.controller.Delete, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
