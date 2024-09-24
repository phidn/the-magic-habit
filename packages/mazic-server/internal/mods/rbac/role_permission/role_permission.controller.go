package role_permission

import (
	"mazic/server/pkg/resp"

	"github.com/labstack/echo/v5"
)

type RolePermissionController struct {
	RolePermissionService RolePermissionService
}

func NewRolePermissionController(rolePermissionService RolePermissionService) *RolePermissionController {
	return &RolePermissionController{
		RolePermissionService: rolePermissionService,
	}
}

func (controller *RolePermissionController) Find(c echo.Context) error {
	result, err := controller.RolePermissionService.Find(c.Request().Context())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to get roles.", err)
	}

	return resp.NewApiSuccess(c, result, "")
}

func (controller *RolePermissionController) Update(c echo.Context) error {
	records := []RolePermissionRecord{}
	if err := c.Bind(&records); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	err := controller.RolePermissionService.Update(c.Request().Context(), records)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to get roles.", err)
	}

	return resp.NewApiSuccess(c, nil, "")
}
