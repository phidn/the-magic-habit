package auth

import (
	"mazic/pocketbase/core"
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"
)

type AuthRoute struct {
	app            *infrastructure.Pocket
	controller     *AuthController
	authMiddleware *middlewares.AuthMiddleware
}

func NewAuthRoute(app *infrastructure.Pocket, controller *AuthController, authMiddleware *middlewares.AuthMiddleware) *AuthRoute {
	return &AuthRoute{
		app:            app,
		controller:     controller,
		authMiddleware: authMiddleware,
	}
}

func (route *AuthRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/mz/auth/login", route.controller.Login)
		e.Router.GET("/mz/auth/me", route.controller.GetMe, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
