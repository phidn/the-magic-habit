package role_permission

import (
	"mazic/mazicapi/server/middleware"

	"github.com/labstack/echo/v4"
)

func RolePermissionRoute(group *echo.Group, middleware *middleware.Middleware, controller *RolePermissionController) {
	group.GET("/roles-permissions", controller.GetList, middleware.IsAuthenticated)
	group.PUT("/roles-permissions", controller.Update, middleware.IsAuthenticated)
}
