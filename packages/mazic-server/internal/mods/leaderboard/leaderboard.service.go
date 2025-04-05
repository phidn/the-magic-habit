package leaderboard

import (
	"context"
	"sort"

	"github.com/golangthang/mazic-habit/pkg/entry"
)

type LeaderboardService interface {
	GetLeaderboard(ctx context.Context) ([]LeaderboardItem, error)
}

type leaderboardService struct {
	Entry entry.Entry
}

func NewLeaderboardService(entry entry.Entry) LeaderboardService {
	return &leaderboardService{
		Entry: entry,
	}
}

func (s *leaderboardService) GetLeaderboard(ctx context.Context) ([]LeaderboardItem, error) {
	var leaderboard []LeaderboardItem

	query := `
		SELECT  u.id AS user_id,
				u.email AS email,
				u.avatar AS avatar,
				u.first_name || ' ' || u.last_name AS full_name,
				u.bio AS bio,
				COUNT(DISTINCT h.id) AS habit_count,
				COUNT(c.id) AS checkin_count
		FROM mz_habits AS h
		LEFT JOIN mz_check_in AS c ON c.habit_id = h.id
		LEFT JOIN sys_user AS u ON u.id = h.user_id
		GROUP BY h.user_id, u.first_name, u.last_name, u.email, u.avatar, u.bio
		ORDER BY checkin_count DESC
	`
	err := s.Entry.Dao().DB().NewQuery(query).All(&leaderboard)
	if err != nil {
		return nil, err
	}

	for idx, item := range leaderboard {
		habitScore := float64(item.HabitCount) * 10
		checkInScore := float64(item.CheckInCount) * 5
		leaderboard[idx].Score = habitScore + checkInScore
	}

	// sort leaderboard by score
	sort.Slice(leaderboard, func(i, j int) bool {
		return leaderboard[i].Score > leaderboard[j].Score
	})

	return leaderboard, nil
}
