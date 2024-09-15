package close_reason

import (
	"net/http"

	util "mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
)

type CloseReasonController struct {
	CloseReasonService *CloseReasonService
}

func NewCloseReasonController(closeReasonService *CloseReasonService) *CloseReasonController {
	return &CloseReasonController{
		CloseReasonService: closeReasonService,
	}
}

// @Router /api/close-reasons [get]
func (controller *CloseReasonController) GetList(c echo.Context) error {
	params := CloseReasonParamsSchema{}
	pagination := util.PaginationPage{}
	if err := util.ParseParamsPagination(c, &params, &pagination); err != nil {
		return util.ResError(c, err)
	}

	result, total, err := controller.CloseReasonService.GetList(c.Request().Context(), params, pagination)
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	pagination.Total = total
	return util.ResPagination(c, result, pagination)
}

// @Router /api/close-reasons/:id [get]
func (controller *CloseReasonController) GetById(c echo.Context) error {
	var result CloseReasonSchema
	if err := controller.CloseReasonService.GetById(c.Request().Context(), c.Param("id"), &result); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, result)
}

// @Router /api/close-reasons [post]
// @Router /api/close-reasons/:id [put]
func (controller *CloseReasonController) Upsert(c echo.Context) error {
	item := new(CloseReasonSchema)
	if err := util.ParseUpsert(c, item); err != nil {
		return util.ResError(c, err)
	}
	if err := controller.CloseReasonService.Upsert(c.Request().Context(), item); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, item.Id)
}

// @Router /api/close-reasons/:id [delete]
func (controller *CloseReasonController) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := controller.CloseReasonService.Delete(c.Request().Context(), id); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, nil)
}
