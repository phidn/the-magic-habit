package auth

type LoginForm struct {
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Tokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
