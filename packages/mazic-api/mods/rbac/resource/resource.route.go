package resource

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func ResourceRoute(group *echo.Group, middleware *middleware.Middleware, controller *ResourceController) {
	group.GET("/resources", controller.GetList, middleware.IsAuthenticated)
	group.GET("/resources/:id", controller.GetById, middleware.IsAuthenticated)
	group.POST("/resources", controller.Upsert, middleware.IsAuthenticated)
	group.PUT("/resources/:id", controller.Upsert, middleware.IsAuthenticated)
	group.DELETE("/resources/:id", controller.Delete, middleware.IsAuthenticated)
}
