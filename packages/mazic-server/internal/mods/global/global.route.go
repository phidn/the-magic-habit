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
		r := e.Router.Group("/mz")
		r.GET("/files/uploads/:file_name", route.controller.GetFile)

		r.Use(route.authMiddleware.IsAuthenticated)
		r.GET("/global/options", route.controller.ListOptions)
		r.POST("/files/upload", route.controller.Upload)
		r.POST("/files/upload-s3", route.controller.UploadS3)
		return nil
	})
}
