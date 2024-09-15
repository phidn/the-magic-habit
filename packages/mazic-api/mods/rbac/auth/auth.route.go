package auth

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func AuthRoute(group *echo.Group, middleware *middleware.Middleware, controller *AuthController) {
	group.GET("/auth/me", controller.GetMe, middleware.IsAuthenticated)
	group.POST("/auth/logout", controller.Logout, middleware.IsAuthenticated)
	group.POST("/auth/login", controller.Login)
	group.POST("/auth/register", controller.Register)
	group.POST("/auth/refresh-token", controller.RefreshToken)
}
