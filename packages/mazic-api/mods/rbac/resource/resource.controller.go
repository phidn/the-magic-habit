package resource

import (
	"net/http"

	util "mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
)

type ResourceController struct {
	ResourceService *ResourceService
}

func NewResourceController(resourceService *ResourceService) *ResourceController {
	return &ResourceController{
		ResourceService: resourceService,
	}
}

// @Router /api/resources [get]
func (controller *ResourceController) GetList(c echo.Context) error {
	params := ResourceParamsSchema{}
	pagination := util.PaginationPage{}
	if err := util.ParseParamsPagination(c, &params, &pagination); err != nil {
		return util.ResError(c, err)
	}

	items, total, err := controller.ResourceService.GetList(c.Request().Context(), params, pagination)
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	pagination.Total = total
	return util.ResPagination(c, items, pagination)
}

// @Router /api/resources/:id [get]
func (controller *ResourceController) GetById(c echo.Context) error {
	result, err := controller.ResourceService.GetById(c.Request().Context(), c.Param("id"))
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, result)
}

// @Router /api/resources [post]
func (controller *ResourceController) Upsert(c echo.Context) error {
	item := new(ResourceSchema)
	if err := util.ParseUpsert(c, item); err != nil {
		return util.ResError(c, err)
	}

	if err := controller.ResourceService.Save(c.Request().Context(), item); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, item.Id)
}

// @Router /api/resources/:id [delete]
func (controller *ResourceController) Delete(c echo.Context) error {
	if err := controller.ResourceService.Delete(c.Request().Context(), c.Param("id")); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, nil)
}
