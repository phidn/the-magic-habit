package permission

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func PermissionRoute(group *echo.Group, middleware *middleware.Middleware, controller *PermissionController) {
	group.GET("/permissions", controller.GetList, middleware.IsAuthenticated)
	group.GET("/permissions/:id", controller.GetById, middleware.IsAuthenticated)
	group.POST("/permissions", controller.Upsert, middleware.IsAuthenticated)
	group.PUT("/permissions/:id", controller.Upsert, middleware.IsAuthenticated)
	group.POST("/permissions/seed", controller.Seed, middleware.IsAuthenticated)
	group.DELETE("/permissions/:id", controller.Delete, middleware.IsAuthenticated)
}
