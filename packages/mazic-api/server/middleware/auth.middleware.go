package middleware

import (
	"database/sql"
	"net/http"
	"strings"

	"mazic/mazicapi/cmd/infrastructure"
	"mazic/mazicapi/constants"
	"mazic/mazicapi/pkg/errors"
	"mazic/mazicapi/server/config"
	util "mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
	"github.com/redis/go-redis/v9"
)

type Middleware struct {
	Rdb *redis.Client
	DB  *infrastructure.Database
}

func NewMiddleware(rdb *redis.Client, db *infrastructure.Database) *Middleware {
	return &Middleware{
		Rdb: rdb,
		DB:  db,
	}
}

func (middleware *Middleware) IsAuthenticated(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Skip authentication for certain routes
		if c.Path() == "/login" {
			return next(c)
		}
		authHeader := c.Request().Header.Get(constants.CONFIG_AUTH_HEADER)
		if authHeader == "" {
			return util.ResError(c, errors.Unauthorized("", constants.MSG_YOU_ARE_NOT_LOGGED_IN), http.StatusUnauthorized)
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != constants.CONFIG_BEARER {
			return util.ResError(c, errors.Unauthorized("", constants.MSG_YOU_ARE_NOT_LOGGED_IN), http.StatusUnauthorized)
		}

		accessToken := parts[1]
		accessTokenDetails, err := util.ValidateToken(accessToken, config.Config.AccessTokenPublicKey)
		if err != nil {
			return util.ResError(c, errors.Unauthorized("", constants.MSG_EXPIRED_TOKEN), http.StatusUnauthorized)
		}

		// Check if token is invalid
		if isValid, _ := util.IsTokenValid(middleware.Rdb, accessTokenDetails.TokenUuid); !isValid {
			return util.ResError(c, errors.Unauthorized("", constants.MSG_INVALID_TOKEN), http.StatusUnauthorized)
		}

		// TODO: Check if token is blacklisted

		c.Set("state.user_id", accessTokenDetails.UserID)
		return next(c)
	}
}

func (middleware *Middleware) HasPermissions(requiredPermissions ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Get user ID from context (set by IsAuthenticated)
			userID := c.Get("state.user_id").(string)

			// Fetch user permissions using UserService
			rawQuery := `
				SELECT P.code
				FROM
					sys_role_permission rp
					LEFT JOIN sys_permission P ON rp.permission_id = P.ID
				WHERE
					role_id IN ( SELECT role_id FROM sys_user_role WHERE user_id = @user_id )
			`
			var userPermissions []string
			err := middleware.DB.Raw(rawQuery, sql.Named("user_id", userID)).Scan(&userPermissions).Error
			if err != nil {
				return util.ResError(c, errors.Forbidden("", constants.MSG_PERMISSION_DENIED), http.StatusForbidden)
			}

			// Check if user has all the required permissions
			for _, requiredPermission := range requiredPermissions {
				if !util.Contains(userPermissions, requiredPermission) {
					return util.ResError(c, errors.Forbidden("", constants.MSG_PERMISSION_DENIED), http.StatusForbidden)
				}
			}

			// User has necessary permissions, continue
			return next(c)
		}
	}
}
