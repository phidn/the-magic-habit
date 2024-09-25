package middlewares

import (
	"mazic/server/config"
	"mazic/server/pkg/token"
	"strings"

	"github.com/pocketbase/pocketbase/apis"

	"github.com/labstack/echo/v5"
)

type AuthMiddleware struct {
}

func NewAuthMiddleware() *AuthMiddleware {
	return &AuthMiddleware{}
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
		return next(c)
	}
}

// func (middleware *Middleware) HasPermissions(requiredPermissions ...string) echo.MiddlewareFunc {
// 	return func(next echo.HandlerFunc) echo.HandlerFunc {
// 		return func(c echo.Context) error {
// 			// Get user ID from context (set by IsAuthenticated)
// 			userID := c.Get("state.user_id").(string)

// 			// Fetch user permissions using UserService
// 			rawQuery := `
// 				SELECT P.code
// 				FROM
// 					sys_role_permission rp
// 					LEFT JOIN sys_permission P ON rp.permission_id = P.ID
// 				WHERE
// 					role_id IN ( SELECT role_id FROM sys_user_role WHERE user_id = @user_id )
// 			`
// 			var userPermissions []string
// 			err := middleware.DB.Raw(rawQuery, sql.Named("user_id", userID)).Scan(&userPermissions).Error
// 			if err != nil {
// 				return util.ResError(c, errors.Forbidden("", config.MSG_PERMISSION_DENIED), http.StatusForbidden)
// 			}

// 			// Check if user has all the required permissions
// 			for _, requiredPermission := range requiredPermissions {
// 				if !util.Contains(userPermissions, requiredPermission) {
// 					return util.ResError(c, errors.Forbidden("", config.MSG_PERMISSION_DENIED), http.StatusForbidden)
// 				}
// 			}

// 			// User has necessary permissions, continue
// 			return next(c)
// 		}
// 	}
// }
