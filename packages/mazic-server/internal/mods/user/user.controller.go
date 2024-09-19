package user

import (
	"mazic/pocketbase/apis"
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

func (controller *UserController) GetUsers(c echo.Context) error {
	requestInfo := apis.RequestInfo(c)
	queryParams := c.QueryParams()

	users, err := controller.UserService.GetUsers(requestInfo, queryParams)
	if err != nil {
		return apis.NewApiError(http.StatusInternalServerError, "failed to get users", err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"users": users,
	})
}
