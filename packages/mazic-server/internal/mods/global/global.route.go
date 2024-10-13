package global

import (
	middlewares "github.com/golangthang/mazic-habit/internal/middlewares"
	"github.com/golangthang/mazic-habit/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type GlobalRoute struct {
	app            *infrastructure.Pocket
	authMiddleware *middlewares.AuthMiddleware
	controller     *GlobalController
}

func NewGlobalRoute(app *infrastructure.Pocket, controller *GlobalController, authMiddleware *middlewares.AuthMiddleware) *GlobalRoute {
	return &GlobalRoute{
		app:            app,
		authMiddleware: authMiddleware,
		controller:     controller,
	}
}

func (route *GlobalRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// e.Router.GET(
		// 	"/*",
		// 	echo.StaticDirectoryHandler(web.DistDirFS, false),
		// 	middleware.Gzip(),
		// )

		r := e.Router.Group("/mz/global")
		r.Use(route.authMiddleware.IsAuthenticated)

		r.GET("/options", route.controller.ListOptions)
		r.POST("/upload", route.controller.Upload)
		return nil
	})
}
