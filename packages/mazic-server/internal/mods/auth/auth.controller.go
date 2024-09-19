package auth

import (
	"mazic/pocketbase/apis"
	"net/http"

	"github.com/labstack/echo/v5"
)

type AuthController struct {
	AuthService *AuthService
}

func NewAuthController(authService *AuthService) *AuthController {
	return &AuthController{
		AuthService: authService,
	}
}

func (controller *AuthController) Login(c echo.Context) error {
	loginReq := new(LoginForm)
	if err := c.Bind(&loginReq); err != nil {
		return apis.NewBadRequestError("failed to read request data", err)
	}
	tokens, user, err := controller.AuthService.Login(loginReq.Email, loginReq.Password)
	if err != nil {
		return apis.NewUnauthorizedError("invalid email or password", err)
	}
	return c.JSON(http.StatusOK, map[string]interface{}{
		"tokens": tokens,
		"user":   user,
	})
}

func (controller *AuthController) GetMe(c echo.Context) error {
	userId := c.Get("state.user_id").(string)
	result, err := controller.AuthService.GetMe(userId)
	if err != nil {
		return apis.NewUnauthorizedError("failed to get user", err)
	}
	return c.JSON(http.StatusOK, map[string]interface{}{
		"current_user": result,
	})
}
