package leaderboard

type LeaderboardItem struct {
	UserId       string  `db:"user_id" json:"user_id"`
	FirstName    string  `db:"first_name" json:"first_name"`
	LastName     string  `db:"last_name" json:"last_name"`
	FullName     string  `db:"full_name" json:"full_name"`
	Email        string  `db:"email" json:"email"`
	Avatar       string  `db:"avatar" json:"avatar"`
	HabitCount   int     `db:"habit_count" json:"habit_count"`
	CheckInCount int     `db:"checkin_count" json:"checkin_count"`
	Rank         int     `json:"rank"`
	Score        float64 `json:"score"`
}
