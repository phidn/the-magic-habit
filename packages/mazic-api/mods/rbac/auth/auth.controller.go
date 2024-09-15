package auth

import (
	"net/http"

	entry_common "mazic/mazicapi/common/entry"
	"mazic/mazicapi/mods/rbac/user"
	util "mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
	"github.com/redis/go-redis/v9"
)

type AuthController struct {
	Rdb          *redis.Client
	AuthService  *AuthService
	UserService  *user.UserService
	EntryService *entry_common.EntryService
}

func NewAuthController(userService *user.UserService, authService *AuthService, entryService *entry_common.EntryService, rdb *redis.Client) *AuthController {
	return &AuthController{
		Rdb:          rdb,
		AuthService:  authService,
		UserService:  userService,
		EntryService: entryService,
	}
}

// @Router /api/v1/auth/me [get]
func (controller *AuthController) GetMe(c echo.Context) error {
	userId := c.Get("state.user_id").(string)
	result, err := controller.UserService.GetById(c.Request().Context(), userId)
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, result)
}

// @Router /api/auth/register [post]
func (controller *AuthController) Register(c echo.Context) error {
	u := AuthRequestSchema{}
	c.Bind(&u)

	if err := u.Validate(); err != nil {
		return util.ResError(c, err, http.StatusBadRequest)
	}

	if err := controller.AuthService.Register(u); err != nil {
		return util.ResError(c, err, http.StatusBadRequest)
	}

	return util.ResSuccess(c, nil)
}

// @Router /api/v1/auth/login [post]
func (controller *AuthController) Login(c echo.Context) error {
	loginReq := LoginRequestSchema{}
	if err := c.Bind(&loginReq); err != nil {
		return err
	}
	result, err := controller.AuthService.Login(loginReq)
	if err != nil {
		return util.ResError(c, err, http.StatusUnauthorized)
	}
	return util.ResSuccess(c, result)
}

// @Router /api/v1/auth/logout [post]
func (controller *AuthController) Logout(c echo.Context) error {
	payload := &TokensSchema{}
	if err := c.Bind(payload); err != nil {
		return util.ResError(c, err, http.StatusForbidden)
	}

	err := controller.AuthService.Logout(c.Request().Context(), payload.AccessToken, payload.RefreshToken)
	if err != nil {
		return util.ResError(c, err, http.StatusForbidden)
	}

	return util.ResSuccess(c, nil)
}

// @Router /api/v1/auth/refresh-token [post]
func (controller *AuthController) RefreshToken(c echo.Context) error {
	payload := &TokensSchema{}
	if err := c.Bind(payload); err != nil {
		return util.ResError(c, err, http.StatusForbidden)
	}

	tokens, err := controller.AuthService.Refresh(c.Request().Context(), payload.RefreshToken)
	if err != nil {
		return util.ResError(c, err, http.StatusForbidden)
	}

	return util.ResSuccess(c, tokens)
}
