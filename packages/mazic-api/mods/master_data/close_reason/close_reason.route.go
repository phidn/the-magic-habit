package close_reason

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func CloseReasonRoute(group *echo.Group, middleware *middleware.Middleware, controller *CloseReasonController) {
	group.GET("/close-reasons", controller.GetList, middleware.IsAuthenticated, middleware.HasPermissions("close_reason.view"))
	group.GET("/close-reasons/:id", controller.GetById, middleware.IsAuthenticated, middleware.HasPermissions("close_reason.view"))
	group.POST("/close-reasons", controller.Upsert, middleware.IsAuthenticated, middleware.HasPermissions("close_reason.create"))
	group.PUT("/close-reasons/:id", controller.Upsert, middleware.IsAuthenticated, middleware.HasPermissions("close_reason.update"))
	group.DELETE("/close-reasons/:id", controller.Delete, middleware.IsAuthenticated, middleware.HasPermissions("close_reason.delete"))
}
