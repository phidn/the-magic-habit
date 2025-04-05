package leaderboard

import (
	middlewares "github.com/golangthang/mazic-habit/internal/middlewares"
	"github.com/golangthang/mazic-habit/pkg/infrastructure"

	"github.com/pocketbase/pocketbase/core"
)

type LeaderboardRoute struct {
	app        *infrastructure.Pocket
	controller *LeaderboardController
}

func NewLeaderboardRoute(app *infrastructure.Pocket, controller *LeaderboardController, authMiddleware *middlewares.AuthMiddleware) *LeaderboardRoute {
	return &LeaderboardRoute{
		app:        app,
		controller: controller,
	}
}

func (route *LeaderboardRoute) SetupRoutes() {
	route.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		r := e.Router.Group("/mz/leaderboard")
		r.GET("", route.controller.GetLeaderboard)
		return nil
	})
}
