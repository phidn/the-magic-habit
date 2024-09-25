package permission

import (
	"mazic/server/pkg/resp"

	"github.com/labstack/echo/v5"
)

type PermissionController struct {
	PermissionService PermissionService
}

func NewPermissionController(permissionService PermissionService) *PermissionController {
	return &PermissionController{
		PermissionService: permissionService,
	}
}

func (controller *PermissionController) Find(c echo.Context) error {
	result, err := controller.PermissionService.Find(c.Request().Context(), c.QueryParams())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to get permissions.", err)
	}

	return resp.NewApiPagination(c, result)
}

func (controller *PermissionController) GetById(c echo.Context) error {
	recordId := c.PathParam("id")
	if recordId == "" {
		return resp.NewNotFoundError(c, "", nil)
	}
	permission, err := controller.PermissionService.FindOne(c.Request().Context(), recordId)
	if err != nil || permission == nil {
		return resp.NewNotFoundError(c, "", err)
	}

	return resp.NewApiSuccess(c, permission, "")
}

func (controller *PermissionController) Create(c echo.Context) error {
	permission := &Permission{}
	if err := c.Bind(permission); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := permission.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.PermissionService.Create(c.Request().Context(), permission)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create permission.", err)
	}

	permission.Id = record.Id
	permission.Created = record.Created
	permission.Updated = record.Updated

	return resp.NewApiCreated(c, permission, "The permission has been created.")
}

func (controller *PermissionController) Update(c echo.Context) error {
	permission := &Permission{}
	if err := c.Bind(permission); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := permission.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.PermissionService.Update(c.Request().Context(), c.PathParam("id"), permission)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to update permission.", err)
	}

	permission.Id = record.Id
	permission.Created = record.Created
	permission.Updated = record.Updated

	return resp.NewApiSuccess(c, permission, "The permission has been updated.")
}

func (controller *PermissionController) Delete(c echo.Context) error {
	permission := &Permission{}
	if err := c.Bind(&permission); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.PermissionService.Delete(c.Request().Context(), c.PathParam("id"))
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete permission.", err)
	}

	return resp.NewApiDeleted(c, "The permission has been deleted.")
}

func (controller *PermissionController) Seed(c echo.Context) error {
	err := controller.PermissionService.Seed(c.Request().Context())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete permission.", err)
	}

	return resp.NewApiDeleted(c, "The permission has been deleted.")
}
