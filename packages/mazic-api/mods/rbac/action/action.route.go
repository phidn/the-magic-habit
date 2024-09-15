package action

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func ActionRoute(group *echo.Group, middleware *middleware.Middleware, controller *ActionController) {
	group.GET("/actions", controller.GetList, middleware.IsAuthenticated)
	group.GET("/actions/:id", controller.GetById, middleware.IsAuthenticated)
	group.POST("/actions", controller.Upsert, middleware.IsAuthenticated)
	group.PUT("/actions/:id", controller.Upsert, middleware.IsAuthenticated)
	group.DELETE("/actions/:id", controller.Delete, middleware.IsAuthenticated)
}
