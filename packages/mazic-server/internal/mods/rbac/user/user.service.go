package user

import (
	"context"
	"net/url"

	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/schema"

	"github.com/pocketbase/pocketbase/models"

	"github.com/pocketbase/dbx"
)

type UserService interface {
	Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error)
	FindOne(ctx context.Context, id string) (*User, error)
	Create(ctx context.Context, user *User) (*models.Record, error)
	Update(ctx context.Context, id string, user *User) (*models.Record, error)
	UpdateProfile(ctx context.Context, id string, user *User) (*models.Record, error)
	Delete(ctx context.Context, id string) (*models.Record, error)
}

type userService struct {
	Entry entry.Entry
}

func NewUserService(entry entry.Entry) UserService {
	return &userService{
		Entry: entry,
	}
}

func (service *userService) Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error) {
	listExpression := []dbx.Expression{}
	email := queryParams.Get("email")
	if email != "" {
		listExpression = append(listExpression, dbx.NewExp("email = {:email}", dbx.Params{"email": email}))
	}

	verified := queryParams.Get("verified")
	if verified != "" {
		listExpression = append(listExpression, dbx.NewExp("verified = {:verified}", dbx.Params{"verified": verified}))
	}

	search := queryParams.Get("search")
	if search != "" {
		listExpression = append(listExpression, dbx.Or(
			dbx.Like("first_name", search),
			dbx.Like("last_name", search),
			dbx.Like("email", search),
		))
	}

	result, err := service.Entry.Find(ctx, &[]*User{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *userService) FindOne(ctx context.Context, id string) (*User, error) {
	user := &User{}
	err := service.Entry.ModelQuery(ctx, user).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(user)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (service *userService) Create(ctx context.Context, user *User) (*models.Record, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(User).TableName())
	if err != nil {
		return nil, err
	}
	if err := user.SetPasswordHash(); err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	user.ParseRecord(record)

	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *userService) Update(ctx context.Context, id string, user *User) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(User).TableName(), id)
	if err != nil {
		return nil, err
	}

	user.ParseRecord(record)

	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *userService) UpdateProfile(ctx context.Context, id string, user *User) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(User).TableName(), id)
	if err != nil {
		return nil, err
	}

	user.ParseProfile(record)
	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}

	recordSetting, err := service.Entry.FindFirstRecordByData(ctx, new(UserSetting).TableName(), "user_id", id)
	if err != nil {
		return nil, err
	}
	recordSetting.Set("user_id", id)
	recordSetting.Set("habit_cols", user.Setting.HabitCols)
	recordSetting.Set("habit_orders", user.Setting.HabitOrders)
	recordSetting.Set("telegram_time", user.Setting.TelegramTime)
	recordSetting.Set("telegram_chat_id", user.Setting.TelegramChatId)
	recordSetting.Set("telegram_bot_token", user.Setting.TelegramBotToken)
	if err := service.Entry.Dao().Save(recordSetting); err != nil {
		return nil, err
	}

	return record, nil
}

func (service *userService) Delete(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(User).TableName(), id)
	if err != nil {
		return nil, err
	}
	// TODO: Serialize record and save it to a log table

	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
