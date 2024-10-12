package resource

import (
	"github.com/golangthang/mazic-habit/pkg/resp"

	"github.com/labstack/echo/v5"
)

type ResourceController struct {
	ResourceService ResourceService
}

func NewResourceController(resourceService ResourceService) *ResourceController {
	return &ResourceController{
		ResourceService: resourceService,
	}
}

func (controller *ResourceController) Find(c echo.Context) error {
	result, err := controller.ResourceService.Find(c.Request().Context(), c.QueryParams())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to get resources.", err)
	}

	return resp.NewApiPagination(c, result)
}

func (controller *ResourceController) GetById(c echo.Context) error {
	recordId := c.PathParam("id")
	if recordId == "" {
		return resp.NewNotFoundError(c, "", nil)
	}
	resource, err := controller.ResourceService.FindOne(c.Request().Context(), recordId)
	if err != nil || resource == nil {
		return resp.NewNotFoundError(c, "", err)
	}

	return resp.NewApiSuccess(c, resource, "")
}

func (controller *ResourceController) Create(c echo.Context) error {
	resource := &Resource{}
	if err := c.Bind(resource); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := resource.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.ResourceService.Create(c.Request().Context(), resource)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create resource.", err)
	}

	resource.Id = record.Id
	resource.Created = record.Created
	resource.Updated = record.Updated

	return resp.NewApiCreated(c, resource, "The resource has been created.")
}

func (controller *ResourceController) Update(c echo.Context) error {
	resource := &Resource{}
	if err := c.Bind(resource); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := resource.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.ResourceService.Update(c.Request().Context(), c.PathParam("id"), resource)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to update resource.", err)
	}

	resource.Id = record.Id
	resource.Created = record.Created
	resource.Updated = record.Updated

	return resp.NewApiSuccess(c, resource, "The resource has been updated.")
}

func (controller *ResourceController) Delete(c echo.Context) error {
	resource := &Resource{}
	if err := c.Bind(&resource); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.ResourceService.Delete(c.Request().Context(), c.PathParam("id"))
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete resource.", err)
	}

	return resp.NewApiDeleted(c, "The resource has been deleted.")
}
