package middlewares

import (
	"strings"

	"github.com/golangthang/mazic-habit/config"
	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/resp"
	"github.com/golangthang/mazic-habit/pkg/token"
	"github.com/golangthang/mazic-habit/pkg/utils"

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
			return apis.NewUnauthorizedError("invalid or expired token", err)
		}

		c.Set("state.user_id", details["sub"])
		c.Set("state.roles", details["roles"])
		return next(c)
	}
}

func (middleware *AuthMiddleware) HasPermissions(requiredCodes ...string) echo.MiddlewareFunc {
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
			for _, code := range requiredCodes {
				// resource, action := utils.SplitString(requiredPermission, ".")
				// permissionCode := config.Config.Shared.GetPermissionCode(resource, action)
				// if permissionCode == "" {
				// 	return resp.NewApplicationError(c, "Invalid permission code.", nil)
				// }
				if !utils.Contains(permissions, code) {
					return resp.NewForbiddenError(c, "You do not have permission to access this resource.", nil)
				}
			}

			// User has necessary permissions, continue
			return next(c)
		}
	}
}
