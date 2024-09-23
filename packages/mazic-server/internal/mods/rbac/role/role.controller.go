package role

import (
	"mazic/server/pkg/resp"

	"github.com/labstack/echo/v5"
)

type RoleController struct {
	RoleService *RoleService
}

func NewRoleController(roleService *RoleService) *RoleController {
	return &RoleController{
		RoleService: roleService,
	}
}

func (controller *RoleController) Find(c echo.Context) error {
	result, err := controller.RoleService.Find(c.Request().Context(), c.QueryParams())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to get roles.", err)
	}

	return resp.NewApiPagination(c, result)
}

func (controller *RoleController) GetById(c echo.Context) error {
	recordId := c.PathParam("id")
	if recordId == "" {
		return resp.NewNotFoundError(c, "", nil)
	}
	role, err := controller.RoleService.FindOne(c.Request().Context(), recordId)
	if err != nil || role == nil {
		return resp.NewNotFoundError(c, "", err)
	}

	return resp.NewApiSuccess(c, role, "")
}

func (controller *RoleController) Create(c echo.Context) error {
	role := &Role{}
	if err := c.Bind(role); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := role.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.RoleService.Create(c.Request().Context(), role)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create role.", err)
	}

	role.Id = record.Id
	role.Created = record.Created
	role.Updated = record.Updated

	return resp.NewApiCreated(c, role, "The role has been created.")
}

func (controller *RoleController) Update(c echo.Context) error {
	role := &Role{}
	if err := c.Bind(role); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := role.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.RoleService.Update(c.Request().Context(), c.PathParam("id"), role)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to update role.", err)
	}

	role.Id = record.Id
	role.Created = record.Created
	role.Updated = record.Updated

	return resp.NewApiSuccess(c, role, "The role has been updated.")
}

func (controller *RoleController) Delete(c echo.Context) error {
	role := &Role{}
	if err := c.Bind(&role); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.RoleService.Delete(c.Request().Context(), c.PathParam("id"))
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete role.", err)
	}

	return resp.NewApiDeleted(c, "The role has been deleted.")
}
