package user

import (
	"mazic/server/pkg/resp"

	"github.com/labstack/echo/v5"
)

type UserController struct {
	UserService *UserService
}

func NewUserController(userService *UserService) *UserController {
	return &UserController{
		UserService: userService,
	}
}

func (controller *UserController) Find(c echo.Context) error {
	result, err := controller.UserService.Find(c.QueryParams())
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
	user, err := controller.UserService.FindOne(recordId)
	if err != nil || user == nil {
		return resp.NewNotFoundError(c, "", err)
	}

	return resp.NewApiSuccess(c, map[string]interface{}{
		"user": user,
	})
}

func (controller *UserController) Create(c echo.Context) error {
	user := &User{}
	if err := c.Bind(&user); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	record, err := controller.UserService.Create(user)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create user.", err)
	}

	user.Id = record.Id
	user.Password = ""
	user.Created = record.Created
	user.Updated = record.Updated

	return resp.NewApiCreated(c, map[string]interface{}{
		"user": user,
	})
}

func (controller *UserController) Update(c echo.Context) error {
	user := &User{}
	if err := c.Bind(&user); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.UserService.Update(c.PathParam("id"), user)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to update user.", err)
	}

	return resp.NewApiSuccess(c, map[string]interface{}{
		"user": user,
	})
}

func (controller *UserController) Delete(c echo.Context) error {
	user := &User{}
	if err := c.Bind(&user); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.UserService.Delete(c.PathParam("id"))
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete user.", err)
	}

	return resp.NewApiDeleted(c)
}
