package role_permission

import (
	"net/http"

	util "mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
)

type RolePermissionController struct {
	RolePermissionService *RolePermissionService
}

func NewRolePermissionController(rolePermissionService *RolePermissionService) *RolePermissionController {
	return &RolePermissionController{
		RolePermissionService: rolePermissionService,
	}
}

// @Router /api/roles-permissions [get]
func (controller *RolePermissionController) GetList(c echo.Context) error {
	result, err := controller.RolePermissionService.GetList(c.Request().Context())
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, result)
}

// @Router /api/roles-permissions [put]
func (controller *RolePermissionController) Update(c echo.Context) error {
	var records []RolePermissionUpsertSchema
	if err := c.Bind(&records); err != nil {
		return util.ResError(c, err, http.StatusBadRequest)
	}

	err := controller.RolePermissionService.Update(c.Request().Context(), records)
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, "Role permissions updated successfully")
}
