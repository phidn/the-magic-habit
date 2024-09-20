package user

import (
	"mazic/server/pkg/resp"
	"net/http"

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
		return resp.NewApiError(http.StatusInternalServerError, "failed to get users", err)
	}

	return resp.NewApiSuccess(c, http.StatusOK, map[string]interface{}{
		"users": result.Items,
		"meta":  result.ResultMeta,
	})
}

func (controller *UserController) GetById(c echo.Context) error {
	recordId := c.PathParam("id")
	if recordId == "" {
		return resp.NewNotFoundError("", nil)
	}
	user, err := controller.UserService.FindOne(recordId)
	if err != nil || user == nil {
		return resp.NewNotFoundError("", err)
	}

	return resp.NewApiSuccess(c, http.StatusOK, map[string]interface{}{
		"user": user,
	})
}

func (controller *UserController) Create(c echo.Context) error {
	user := &User{}
	if err := c.Bind(&user); err != nil {
		return resp.NewBadRequestError("failed to read request data", err)
	}

	record, err := controller.UserService.Create(user)
	if err != nil {
		return resp.NewApiError(http.StatusInternalServerError, "failed to create user", err)
	}

	user.Id = record.Id
	user.Password = ""
	user.Created = record.Created
	user.Updated = record.Updated

	return resp.NewApiSuccess(c, http.StatusOK, map[string]interface{}{
		"user": user,
	})
}

func (controller *UserController) Update(c echo.Context) error {
	user := &User{}
	if err := c.Bind(&user); err != nil {
		return resp.NewBadRequestError("failed to read request data", err)
	}

	_, err := controller.UserService.Update(c.PathParam("id"), user)
	if err != nil {
		return resp.NewApiError(http.StatusInternalServerError, "failed to update user", err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"user": user,
	})
}

func (controller *UserController) Delete(c echo.Context) error {
	user := &User{}
	if err := c.Bind(&user); err != nil {
		return resp.NewBadRequestError("failed to read request data", err)
	}

	_, err := controller.UserService.Delete(c.PathParam("id"))
	if err != nil {
		return resp.NewApiError(http.StatusInternalServerError, "failed to update user", err)
	}

	return resp.NewApiSuccess(c, http.StatusOK, map[string]interface{}{})
}
