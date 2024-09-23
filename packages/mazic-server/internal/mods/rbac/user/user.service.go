package user

import (
	"mazic/pocketbase/models"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/schema"
	"net/url"

	"github.com/pocketbase/dbx"
)

type UserService struct {
	Entry *entry.Entry
}

func NewUserService(entry *entry.Entry) *UserService {
	return &UserService{
		Entry: entry,
	}
}

func (service *UserService) Find(queryParams url.Values) (*schema.ResultPagination, error) {
	query := service.Entry.ModelQuery(&User{})

	email := queryParams.Get("email")
	if email != "" {
		query = query.AndWhere(dbx.NewExp("email = {:email}", dbx.Params{"email": email}))
	}

	verified := queryParams.Get("verified")
	if verified != "" {
		query = query.AndWhere(dbx.NewExp("verified = {:verified}", dbx.Params{"verified": verified}))
	}

	search := queryParams.Get("search")
	if search != "" {
		query = query.AndWhere(
			dbx.Or(
				dbx.Like("first_name", search),
				dbx.Like("last_name", search),
				dbx.Like("email", search),
			),
		)
	}

	users := []*User{}
	result, err := service.Entry.Find(&users, query, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *UserService) FindOne(id string) (*User, error) {
	user := new(User)
	err := service.Entry.ModelQuery(&User{}).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(&user)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (service *UserService) Create(user *User) (*models.Record, error) {
	collection, err := service.Entry.Dao().FindCollectionByNameOrId(new(User).TableName())
	if err != nil {
		return nil, err
	}
	if err := user.SetPasswordHash(); err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	user.ParseRecord(record)

	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *UserService) Update(id string, user *User) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(User).TableName(), id)
	if err != nil {
		return nil, err
	}

	user.ParseRecord(record)

	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *UserService) Delete(id string) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(User).TableName(), id)
	if err != nil {
		return nil, err
	}
	// TODO: Serialize record and save it to a log table

	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
