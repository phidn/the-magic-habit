package middlewares

import (
	"mazic/server/config"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/resp"
	"mazic/server/pkg/token"
	"mazic/server/pkg/utils"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"

	"github.com/labstack/echo/v5"
)

type AuthMiddleware struct {
	Entry entry.Entry
}

func NewAuthMiddleware(entry entry.Entry) *AuthMiddleware {
	return &AuthMiddleware{
		Entry: entry,
	}
}

func (middleware *AuthMiddleware) IsAuthenticated(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Skip authentication for certain routes
		if c.Path() == "/mz/auth/login" {
			return next(c)
		}
		authHeader := c.Request().Header.Get(config.CONFIG_AUTH_HEADER)
		if authHeader == "" {
			return apis.NewUnauthorizedError("invalid token", nil)
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != config.CONFIG_BEARER {
			return apis.NewUnauthorizedError("invalid token", nil)
		}

		accessToken := parts[1]
		details, err := token.ValidateToken(accessToken, config.Config.AccessTokenPublicKey)
		if err != nil || details["sub"] == nil || details["sub"] == "" {
			return apis.NewUnauthorizedError("expired token", err)
		}

		c.Set("state.user_id", details["sub"])
		c.Set("state.roles", details["roles"])
		return next(c)
	}
}

func (middleware *AuthMiddleware) HasPermissions(requiredPermissions ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			roles := c.Get("state.roles").([]interface{})

			var permissions []string
			err := middleware.Entry.Dao().DB().
				Select("p.code").
				From("sys_role_permission rp").
				LeftJoin("sys_permission p", dbx.NewExp("rp.permission_id = p.id")).
				Where(dbx.In("role_id", roles...)).
				AndWhere(dbx.NewExp("p.code IS NOT NULL")).
				Column(&permissions)

			if err != nil {
				return resp.NewApplicationError(c, "Failed to get user permissions.", err)
			}

			// Check if user has all the required permissions
			for _, requiredPermission := range requiredPermissions {
				if !utils.Contains(permissions, requiredPermission) {
					return resp.NewForbiddenError(c, "You do not have permission to access this resource.", nil)
				}
			}

			// User has necessary permissions, continue
			return next(c)
		}
	}
}
