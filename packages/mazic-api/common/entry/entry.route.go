package entry_common

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func EntryRoute(group *echo.Group, middleware *middleware.Middleware, controller *EntryController) {
	group.GET("/entry/options", controller.GetOptions, middleware.IsAuthenticated)
	group.GET("/entry/tags", controller.GetTags, middleware.IsAuthenticated)
	group.POST("/entry/upload", controller.Upload, middleware.IsAuthenticated)
}
