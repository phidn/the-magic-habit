package user

import (
	"github.com/golangthang/mazic-habit/pkg/resp"

	"github.com/labstack/echo/v5"
)

type UserController struct {
	UserService UserService
}

func NewUserController(userService UserService) *UserController {
	return &UserController{
		UserService: userService,
	}
}

func (controller *UserController) Find(c echo.Context) error {
	result, err := controller.UserService.Find(c.Request().Context(), c.QueryParams())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to get users.", err)
	}

	return resp.NewApiPagination(c, result)
}

func (controller *UserController) GetById(c echo.Context) error {
	recordId := c.PathParam("id")
	if recordId == "" {
		return resp.NewNotFoundError(c, "", nil)
	}
	user, err := controller.UserService.FindOne(c.Request().Context(), recordId)
	if err != nil || user == nil {
		return resp.NewNotFoundError(c, "", err)
	}

	return resp.NewApiSuccess(c, user, "")
}

func (controller *UserController) Create(c echo.Context) error {
	user := &User{}
	if err := c.Bind(user); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := user.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}

	record, err := controller.UserService.Create(c.Request().Context(), user)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create user.", err)
	}

	user.Id = record.Id
	user.Password = ""
	user.Created = record.Created
	user.Updated = record.Updated

	return resp.NewApiCreated(c, user, "The user has been created.")
}

func (controller *UserController) Update(c echo.Context) error {
	user := &User{}
	if err := c.Bind(user); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := user.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}

	record, err := controller.UserService.Update(c.Request().Context(), c.PathParam("id"), user)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to update user.", err)
	}

	user.Id = record.Id
	user.Created = record.Created
	user.Updated = record.Updated

	return resp.NewApiSuccess(c, user, "The user has been updated.")
}

func (controller *UserController) UpdateProfile(c echo.Context) error {
	user := &User{}
	if err := c.Bind(user); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := user.ValidateProfile(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}

	userId := c.Get("state.user_id").(string)

	record, err := controller.UserService.UpdateProfile(c.Request().Context(), userId, user)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to update user.", err)
	}

	user.Id = record.Id
	user.Created = record.Created
	user.Updated = record.Updated

	return resp.NewApiSuccess(c, user, "The user has been updated.")
}

func (controller *UserController) Delete(c echo.Context) error {
	user := &User{}
	if err := c.Bind(&user); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.UserService.Delete(c.Request().Context(), c.PathParam("id"))
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete user.", err)
	}

	return resp.NewApiDeleted(c, "The user has been deleted.")
}
