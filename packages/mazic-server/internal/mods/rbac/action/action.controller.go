package action

import (
	"mazic/server/pkg/resp"

	"github.com/labstack/echo/v5"
)

type ActionController struct {
	ActionService ActionService
}

func NewActionController(actionService ActionService) *ActionController {
	return &ActionController{
		ActionService: actionService,
	}
}

func (controller *ActionController) Find(c echo.Context) error {
	result, err := controller.ActionService.Find(c.Request().Context(), c.QueryParams())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to get actions.", err)
	}

	return resp.NewApiPagination(c, result)
}

func (controller *ActionController) GetById(c echo.Context) error {
	recordId := c.PathParam("id")
	if recordId == "" {
		return resp.NewNotFoundError(c, "", nil)
	}
	action, err := controller.ActionService.FindOne(c.Request().Context(), recordId)
	if err != nil || action == nil {
		return resp.NewNotFoundError(c, "", err)
	}

	return resp.NewApiSuccess(c, action, "")
}

func (controller *ActionController) Create(c echo.Context) error {
	action := &Action{}
	if err := c.Bind(action); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := action.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.ActionService.Create(c.Request().Context(), action)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create action.", err)
	}

	action.Id = record.Id
	action.Created = record.Created
	action.Updated = record.Updated

	return resp.NewApiCreated(c, action, "The action has been created.")
}

func (controller *ActionController) Update(c echo.Context) error {
	action := &Action{}
	if err := c.Bind(action); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := action.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.ActionService.Update(c.Request().Context(), c.PathParam("id"), action)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to update action.", err)
	}

	action.Id = record.Id
	action.Created = record.Created
	action.Updated = record.Updated

	return resp.NewApiSuccess(c, action, "The action has been updated.")
}

func (controller *ActionController) Delete(c echo.Context) error {
	action := &Action{}
	if err := c.Bind(&action); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.ActionService.Delete(c.Request().Context(), c.PathParam("id"))
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete action.", err)
	}

	return resp.NewApiDeleted(c, "The action has been deleted.")
}
