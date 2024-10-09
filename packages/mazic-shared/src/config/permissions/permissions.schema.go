package permissions_schema

type Permissions struct {
	Administration Administration `json:"administration"`
	Habit          Habit          `json:"habit"`
	HabitCheckIn   HabitCheckIn   `json:"habit_check_in"`
	Dashboard      Dashboard      `json:"dashboard"`
	Profile        Profile        `json:"profile"`
}

type Administration struct {
	AllActions string `json:"all_actions"`
}

type Dashboard struct {
	View string `json:"view"`
}

type Habit struct {
	View   string `json:"view"`
	Create string `json:"create"`
	Update string `json:"update"`
	Delete string `json:"delete"`
}

type HabitCheckIn struct {
	Save   string `json:"save"`
	Delete string `json:"delete"`
}

type Profile struct {
	Save string `json:"save"`
}
