package auth

import (
	"github.com/golangthang/mazic-habit/pkg/resp"

	"github.com/labstack/echo/v5"
)

type AuthController struct {
	AuthService AuthService
}

func NewAuthController(authService AuthService) *AuthController {
	return &AuthController{
		AuthService: authService,
	}
}

func (controller *AuthController) Login(c echo.Context) error {
	loginReq := new(LoginForm)
	if err := c.Bind(&loginReq); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	tokens, user, err := controller.AuthService.Login(c.Request().Context(), loginReq.Email, loginReq.Password)
	if err != nil {
		return resp.NewUnauthorizedError(c, "Invalid email or password.", err)
	}
	result := map[string]interface{}{
		"access_token":  tokens.AccessToken,
		"refresh_token": tokens.RefreshToken,
		"user":          user,
	}
	return resp.NewApiSuccess(c, result, "")
}

func (controller *AuthController) Register(c echo.Context) error {
	userReg := &UserRegister{}
	if err := c.Bind(userReg); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := userReg.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}

	record, err := controller.AuthService.Register(c.Request().Context(), userReg)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create user.", err)
	}

	userReg.Id = record.Id
	userReg.Password = ""
	userReg.Created = record.Created
	userReg.Updated = record.Updated

	return resp.NewApiCreated(c, userReg, "The user has been created successfully.")
}

func (controller *AuthController) GetMe(c echo.Context) error {
	userId := c.Get("state.user_id").(string)
	if userId == "" {
		return resp.NewUnauthorizedError(c, "", nil)
	}
	result, err := controller.AuthService.GetMe(c.Request().Context(), userId)
	if err != nil {
		return resp.NewUnauthorizedError(c, "Failed to get user.", err)
	}
	return resp.NewApiSuccess(c, result, "")
}
