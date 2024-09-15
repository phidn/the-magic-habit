package permission

import (
	"net/http"

	util "mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
)

type PermissionController struct {
	PermissionService *PermissionService
}

func NewPermissionController(permissionService *PermissionService) *PermissionController {
	return &PermissionController{
		PermissionService: permissionService,
	}
}

// @Router /api/permissions [get]
func (controller *PermissionController) GetList(c echo.Context) error {
	params := PermissionParamsSchema{}
	pagination := util.PaginationPage{}
	if err := util.ParseParamsPagination(c, &params, &pagination); err != nil {
		return util.ResError(c, err)
	}

	items, total, err := controller.PermissionService.GetList(c.Request().Context(), params, pagination)
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	pagination.Total = total
	return util.ResPagination(c, items, pagination)
}

// @Router /api/permission/:id [get]
func (controller *PermissionController) GetById(c echo.Context) error {
	result, err := controller.PermissionService.GetById(c.Request().Context(), c.Param("id"))
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, result)
}

// @Router /api/permission [post]
func (controller *PermissionController) Upsert(c echo.Context) error {
	ctx := c.Request().Context()
	item := new(PermissionSchema)
	if err := util.ParseUpsert(c, item); err != nil {
		return util.ResError(c, err)
	}

	if err := controller.PermissionService.Upsert(ctx, item); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, item.Id)
}

// @Router /api/permission/:id [delete]
func (controller *PermissionController) Delete(c echo.Context) error {
	ctx := c.Request().Context()
	id := c.Param("id")
	if err := controller.PermissionService.Delete(ctx, id); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, nil)
}

func (controller *PermissionController) Seed(c echo.Context) error {
	createdBy := c.Get("state.user_id").(string)
	if err := controller.PermissionService.Seed(createdBy); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, nil)
}
