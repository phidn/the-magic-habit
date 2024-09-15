package user

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func UserRoute(group *echo.Group, middleware *middleware.Middleware, controller *UserController) {
	group.GET("/users", controller.GetList, middleware.IsAuthenticated)
	group.GET("/users/:id", controller.GetById, middleware.IsAuthenticated)
	group.POST("/users", controller.CreateUser, middleware.IsAuthenticated)
	group.PUT("/users/:id", controller.UpdateUser, middleware.IsAuthenticated)
	group.DELETE("/users/:id", controller.DeleteUser, middleware.IsAuthenticated)

	// group.GET("/auth/me", controller.GetMe, middleware.IsAuthenticated)
	// group.POST("/auth/logout", controller.Logout, middleware.IsAuthenticated)
	// group.POST("/auth/login", controller.Login)
	// group.POST("/auth/register", controller.RegisterUser)
	// group.POST("/auth/refresh-token", controller.RefreshToken)
}
