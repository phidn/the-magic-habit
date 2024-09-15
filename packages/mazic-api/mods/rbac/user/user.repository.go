package user

import "mazic/mazicapi/cmd/infrastructure"

type UserRepository struct {
	DB *infrastructure.Database
}

func NewUserRepository(db *infrastructure.Database) *UserRepository {
	return &UserRepository{
		DB: db,
	}
}

func (repo *UserRepository) RegisterUser(user UserSchema) error {
	return repo.DB.Create(&user).Error
}

func (repo *UserRepository) GetUserByID(userID string) (UserSchema, error) {
	var user UserSchema
	if err := repo.DB.Raw(`SELECT * FROM sys_user WHERE id=$1`, userID).Scan(&user).Error; err != nil {
		return user, err
	}
	return user, nil
}

func (repo *UserRepository) GetUserByUsername(username string) (UserSchema, error) {
	var user UserSchema
	if err := repo.DB.Raw(`SELECT * FROM sys_user WHERE username=$1`, username).Scan(&user).Error; err != nil {
		return user, err
	}
	return user, nil
}

func (repo *UserRepository) GetUserByEmail(email string) (UserSchema, error) {
	var user UserSchema
	if err := repo.DB.Raw(`SELECT * FROM sys_user WHERE email=$1`, email).Scan(&user).Error; err != nil {
		return user, err
	}
	return user, nil
}
