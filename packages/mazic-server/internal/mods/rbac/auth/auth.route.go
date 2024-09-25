package auth

import (
	middlewares "mazic/server/internal/middlewares"
	"mazic/server/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type AuthRoute struct {
	app            *infrastructure.Pocket
	authController *AuthController
	authMiddleware *middlewares.AuthMiddleware
}

func NewAuthRoute(app *infrastructure.Pocket, authController *AuthController, authMiddleware *middlewares.AuthMiddleware) *AuthRoute {
	return &AuthRoute{
		app:            app,
		authController: authController,
		authMiddleware: authMiddleware,
	}
}

func (route *AuthRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/mz/auth/login", route.authController.Login)
		e.Router.GET("/mz/auth/me", route.authController.GetMe, route.authMiddleware.IsAuthenticated)
		return nil
	})
}
