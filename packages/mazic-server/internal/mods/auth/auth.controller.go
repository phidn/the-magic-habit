package auth

import (
	"mazic/server/pkg/resp"

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
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	tokens, user, err := controller.AuthService.Login(loginReq.Email, loginReq.Password)
	if err != nil {
		return resp.NewUnauthorizedError(c, "Invalid email or password.", err)
	}
	return resp.NewApiSuccess(c, map[string]interface{}{
		"tokens": tokens,
		"user":   user,
	})
}

func (controller *AuthController) GetMe(c echo.Context) error {
	userId := c.Get("state.user_id").(string)
	result, err := controller.AuthService.GetMe(userId)
	if err != nil {
		return resp.NewUnauthorizedError(c, "Failed to get user.", err)
	}
	return resp.NewApiSuccess(c, map[string]interface{}{
		"current_user": result,
	})
}
