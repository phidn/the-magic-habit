package role

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func RoleRoute(group *echo.Group, middleware *middleware.Middleware, controller *RoleController) {
	group.GET("/roles", controller.GetList, middleware.IsAuthenticated)
	group.GET("/roles/:id", controller.GetById, middleware.IsAuthenticated)
	group.POST("/roles", controller.Upsert, middleware.IsAuthenticated)
	group.PUT("/roles/:id", controller.Upsert, middleware.IsAuthenticated)
	group.DELETE("/roles/:id", controller.Delete, middleware.IsAuthenticated)
}
