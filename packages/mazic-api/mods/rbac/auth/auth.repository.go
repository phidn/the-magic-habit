package auth

import "mazic/mazicapi/cmd/infrastructure"

type AuthRepository struct {
	DB *infrastructure.Database
}

func NewAuthRepository(db *infrastructure.Database) *AuthRepository {
	return &AuthRepository{
		DB: db,
	}
}

func (repo *AuthRepository) Register(user AuthSchema) error {
	return repo.DB.Create(&user).Error
}

func (repo *AuthRepository) GetAuthByID(userID string) (AuthSchema, error) {
	var user AuthSchema
	if err := repo.DB.Raw(`SELECT * FROM sys_user WHERE id=$1`, userID).Scan(&user).Error; err != nil {
		return user, err
	}
	return user, nil
}

func (repo *AuthRepository) GetAuthByEmail(email string) (AuthSchema, error) {
	var user AuthSchema
	if err := repo.DB.Raw(`SELECT * FROM sys_user WHERE email=$1`, email).Scan(&user).Error; err != nil {
		return user, err
	}
	return user, nil
}
