package role

import (
	"net/http"
	"mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
)

type RoleController struct {
	RoleService *RoleService
}

func NewRoleController(roleService *RoleService) *RoleController {
	return &RoleController{
		RoleService: roleService,
	}
}

// @Router /api/roles [get]
func (controller *RoleController) GetList(c echo.Context) error {
	params := RoleParamsSchema{}
	pagination := util.PaginationPage{}
	if err := util.ParseParamsPagination(c, &params, &pagination); err != nil {
		return util.ResError(c, err)
	}

	items, total, err := controller.RoleService.GetList(c.Request().Context(), params, pagination)
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	pagination.Total = total
	return util.ResPagination(c, items, pagination)
}

// @Router /api/roles/:id [get]
func (controller *RoleController) GetById(c echo.Context) error {
	result, err := controller.RoleService.GetById(c.Request().Context(), c.Param("id"))
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, result)
}

// @Router /api/roles [post]
// @Router /api/roles/:id [put]
func (controller *RoleController) Upsert(c echo.Context) error {
	ctx := c.Request().Context()
	item := new(RoleSchema)
	if err := util.ParseUpsert(c, item); err != nil {
		return util.ResError(c, err)
	}

	if err := controller.RoleService.Upsert(ctx, item); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, item.Id)
}

// @Router /api/roles/:id [delete]
func (controller *RoleController) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := controller.RoleService.Delete(c.Request().Context(), id); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, nil)
}
