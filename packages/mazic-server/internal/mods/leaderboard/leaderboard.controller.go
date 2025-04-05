package leaderboard

import (
	"github.com/golangthang/mazic-habit/pkg/resp"
	"github.com/labstack/echo/v5"
)

type LeaderboardController struct {
	Service LeaderboardService
}

func NewLeaderboardController(service LeaderboardService) *LeaderboardController {
	return &LeaderboardController{
		Service: service,
	}
}

func (lc *LeaderboardController) GetLeaderboard(c echo.Context) error {
	data, err := lc.Service.GetLeaderboard(c.Request().Context())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to fetch leaderboard", err)
	}
	return resp.NewApiSuccess(c, data, "Leaderboard fetched successfully")
}
