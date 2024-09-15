package action

import (
	"net/http"

	util "mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
)

type ActionController struct {
	ActionService *ActionService
}

func NewActionController(actionService *ActionService) *ActionController {
	return &ActionController{
		ActionService: actionService,
	}
}

// @Router /api/actions [get]
func (controller *ActionController) GetList(c echo.Context) error {
	params := ActionParamsSchema{}
	pagination := util.PaginationPage{}
	if err := util.ParseParamsPagination(c, &params, &pagination); err != nil {
		return util.ResError(c, err)
	}

	items, total, err := controller.ActionService.GetList(c.Request().Context(), params, pagination)
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	pagination.Total = total
	return util.ResPagination(c, items, pagination)
}

// @Router /api/actions/:id [get]
func (controller *ActionController) GetById(c echo.Context) error {
	result, err := controller.ActionService.GetById(c.Request().Context(), c.Param("id"))
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, result)
}

// @Router /api/actions [post]
func (controller *ActionController) Upsert(c echo.Context) error {
	ctx := c.Request().Context()
	item := new(ActionSchema)
	if err := util.ParseUpsert(c, item); err != nil {
		return util.ResError(c, err)
	}

	if err := controller.ActionService.Upsert(ctx, item); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, nil)
}

// @Router /api/actions/:id [delete]
func (controller *ActionController) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := controller.ActionService.Delete(c.Request().Context(), id); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, nil)
}

