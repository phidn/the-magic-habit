package auth

import (
	"context"
	"log"
	"time"

	"mazic/mazicapi/cmd/infrastructure"
	entry_common "mazic/mazicapi/common/entry"
	"mazic/mazicapi/mods/rbac/user"
	"mazic/mazicapi/pkg/errors"
	"mazic/mazicapi/server/config"
	util "mazic/mazicapi/util"

	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	DB             *infrastructure.Database
	AuthRepository *AuthRepository
	EntryService   *entry_common.EntryService
	UserService    *user.UserService
	Rdb            *redis.Client
}

func NewAuthService(db *infrastructure.Database, userRepository *AuthRepository, entryService *entry_common.EntryService, userService *user.UserService, rdb *redis.Client) *AuthService {
	return &AuthService{
		DB:             db,
		AuthRepository: userRepository,
		EntryService:   entryService,
		UserService:    userService,
		Rdb:            rdb,
	}
}

func (service *AuthService) Register(dto AuthRequestSchema) error {
	user := AuthSchema{
		Email:     dto.Email,
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Password:  dto.Password,
	}

	if _, err := service.AuthRepository.GetAuthByEmail(user.Email); err == nil {
		return errors.BadRequest("", "email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("unable to hash password: %v", err)
		return errors.BadRequest("", "internal error: unable to create user")
	}
	user.Password = string(hashedPassword)
	return service.AuthRepository.Register(user)
}

func (service *AuthService) CreateTokens(id string) (*TokensSchema, error) {
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

func (service *AuthService) DestroyTokens(accessTokenUuid, refreshTokenUuid string) error {
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

func (service *AuthService) Login(loginReq LoginRequestSchema) (*TokensSchema, error) {
	user, err := service.AuthRepository.GetAuthByEmail(loginReq.Email)
	if err != nil {
		return nil, errors.BadRequest("", "invalid email or password")
	}

	if !user.CheckPassword(loginReq.Password) {
		return nil, errors.BadRequest("", "invalid email or password")
	}

	return service.CreateTokens(user.Id)
}

func (service *AuthService) GetAuthByEmail(email string) (AuthSchema, error) {
	return service.AuthRepository.GetAuthByEmail(email)
}

func (service *AuthService) GetAuthByID(id string) (AuthSchema, error) {
	return service.AuthRepository.GetAuthByID(id)
}

func (service *AuthService) Logout(ctx context.Context, accessToken, refreshToken string) error {
	accessTokenClaims, err := util.ValidateToken(accessToken, config.Config.AccessTokenPublicKey)
	if err != nil {
		return err
	}
	if _, err = service.Rdb.Del(ctx, accessTokenClaims.TokenUuid).Result(); err != nil {
		return err
	}

	refreshTokenClaims, err := util.ValidateToken(refreshToken, config.Config.RefreshTokenPublicKey)
	if err != nil {
		return err
	}
	if _, err = service.Rdb.Del(ctx, refreshTokenClaims.TokenUuid).Result(); err != nil {
		return err
	}

	return nil
}

func (service *AuthService) Refresh(ctx context.Context, refreshToken string) (*TokensSchema, error) {
	tokenClaims, err := util.ValidateToken(refreshToken, config.Config.RefreshTokenPublicKey)
	if err != nil {
		return nil, err
	}

	userID, err := service.Rdb.Get(context.Background(), tokenClaims.TokenUuid).Result()
	if err != nil {
		return nil, err
	}

	user, err := service.UserService.GetById(ctx, userID)
	if err != nil {
		return nil, errors.BadRequest("", "the user belonging to this token no logger exists")
	}

	tokens, err := service.CreateTokens(user.Id)
	if err != nil {
		return nil, err
	}

	return tokens, nil
}
