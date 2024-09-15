package user

import (
	"context"
	"log"
	"time"

	"mazic/mazicapi/cmd/infrastructure"
	entry_common "mazic/mazicapi/common/entry"
	"mazic/mazicapi/pkg/errors"
	"mazic/mazicapi/server/config"
	util "mazic/mazicapi/util"

	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm/clause"
)

type UserService struct {
	DB             *infrastructure.Database
	UserRepository *UserRepository
	EntryService   *entry_common.EntryService
	Rdb            *redis.Client
}

func NewUserService(db *infrastructure.Database, userRepository *UserRepository, entryService *entry_common.EntryService, rdb *redis.Client) *UserService {
	return &UserService{
		DB:             db,
		UserRepository: userRepository,
		EntryService:   entryService,
		Rdb:            rdb,
	}
}

func (service *UserService) RegisterUser(dto UserRequestSchema) error {
	user := UserSchema{
		Email:     dto.Email,
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Password:  dto.Password,
	}

	if _, err := service.UserRepository.GetUserByEmail(user.Email); err == nil {
		return errors.BadRequest("", "email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("unable to hash password: %v", err)
		return errors.BadRequest("", "internal error: unable to create user")
	}
	user.Password = string(hashedPassword)
	return service.UserRepository.RegisterUser(user)
}

func (service *UserService) CreateTokens(id string) (*TokensSchema, error) {
	accessTokenDetails, err := util.CreateToken(id, config.Config.AccessTokenExpiresIn, config.Config.AccessTokenPrivateKey)
	if err != nil {
		return nil, err
	}

	refreshTokenDetails, err := util.CreateToken(id, config.Config.RefreshTokenExpiresIn, config.Config.RefreshTokenPrivateKey)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	ctx := context.Background()

	errAccess := service.Rdb.Set(ctx, accessTokenDetails.TokenUuid, id, time.Unix(*accessTokenDetails.ExpiresIn, 0).Sub(now)).Err()
	if errAccess != nil {
		return nil, errAccess
	}
	errRefresh := service.Rdb.Set(ctx, refreshTokenDetails.TokenUuid, id, time.Unix(*refreshTokenDetails.ExpiresIn, 0).Sub(now)).Err()
	if errRefresh != nil {
		return nil, errRefresh
	}

	return &TokensSchema{
		AccessToken:  *accessTokenDetails.Token,
		RefreshToken: *refreshTokenDetails.Token,
	}, nil
}

func (service *UserService) DestroyTokens(accessTokenUuid, refreshTokenUuid string) error {
	ctx := context.Background()
	_, errAccess := service.Rdb.Del(ctx, accessTokenUuid).Result()
	if errAccess != nil {
		return errAccess
	}
	_, errRefresh := service.Rdb.Del(ctx, refreshTokenUuid).Result()
	if errRefresh != nil {
		return errRefresh
	}
	return nil
}

func (service *UserService) AuthenticateUser(loginReq LoginRequestSchema) (*TokensSchema, error) {
	user, err := service.UserRepository.GetUserByEmail(loginReq.Email)
	if err != nil {
		return nil, errors.BadRequest("", "invalid email or password")
	}

	if !user.CheckPassword(loginReq.Password) {
		return nil, errors.BadRequest("", "invalid email or password")
	}

	return service.CreateTokens(user.Id)
}

func (service *UserService) GetUserByEmail(email string) (UserSchema, error) {
	return service.UserRepository.GetUserByEmail(email)
}

func (service *UserService) GetUserByID(id string) (UserSchema, error) {
	return service.UserRepository.GetUserByID(id)
}

func (service *UserService) GetList(ctx context.Context, params UserParamsSchema, pagination util.PaginationPage) ([]UserSchema, int64, error) {
	var items []UserSchema
	filters := entry_common.Filters{
		PreloadFields: []string{"UserRoles", "UserRoles.Role"},
		Search: map[string]interface{}{
			"email": params.Search,
		},
		Filters: map[string]interface{}{
			"is_active": params.IsActive,
		},
		Sort:       params.Sort,
		OmitFields: []string{"password"},
	}
	total, err := service.EntryService.GetList(ctx, &items, pagination, &filters)
	if err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (service *UserService) GetById(ctx context.Context, id string) (*UserSchema, error) {
	var result UserSchema
	filters := entry_common.Filters{
		PreloadFields: []string{"UserRoles", "UserRoles.Role"},
		OmitFields:    []string{"password"},
	}
	err := service.EntryService.GetById(ctx, &result, id, &filters)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (service *UserService) CreateUser(ctx context.Context, dto *UserSchema) error {
	if err := dto.FillPassword(); err != nil {
		return err
	}
	if err := dto.FillUserRoles(); err != nil {
		return err
	}

	return service.EntryService.Create(ctx, dto)
}

func (service *UserService) UpdateUser(ctx context.Context, id string, dto *UserSchema) error {
	if err := dto.FillUserRoles(); err != nil {
		return err
	}

	err := service.DB.Exec(ctx, func(ctx context.Context) error {
		filters := entry_common.Filters{
			SelectFields: []string{
				"first_name",
				"last_name",
				"email",
				"phone",
				"avatar",
				"updated_by",
			},
		}

		if err := service.EntryService.Update(ctx, dto.Id, dto, &filters); err != nil {
			return err
		}

		err := service.EntryService.DB(ctx).
			Where("user_id = ? AND role_id NOT IN (?)", id, dto.UserRoleIds).
			Delete(new(UserRoleSchema)).
			Error
		if err != nil {
			return err
		}

		for _, userRole := range dto.UserRoles {
			if err := service.EntryService.DB(ctx).
				Clauses(clause.OnConflict{DoNothing: true}).
				Create(&userRole).
				Error; err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return err
	}

	return nil
}
