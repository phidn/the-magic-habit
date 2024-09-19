package user

import (
	"mazic/pocketbase/models"
	"mazic/pocketbase/resolvers"
	"mazic/pocketbase/tools/search"
	"mazic/server/pkg/infrastructure"
	"net/url"
)

type UserService struct {
	app *infrastructure.Pocket
}

func NewUserService(app *infrastructure.Pocket) *UserService {
	return &UserService{app: app}
}

func (service *UserService) GetUsers(requestInfo *models.RequestInfo, queryParams url.Values) ([]*models.Record, error) {
	collection, err := service.app.Dao().FindCollectionByNameOrId("sys_user")
	if err != nil {
		return nil, err
	}

	fieldsResolver := resolvers.NewRecordFieldResolver(
		service.app.Dao(),
		collection,
		requestInfo,
		// hidden fields are searchable only by admins
		requestInfo.Admin != nil,
	)

	searchProvider := search.NewProvider(fieldsResolver).
		Query(service.app.Dao().RecordQuery(collection))

	if requestInfo.Admin == nil && collection.ListRule != nil {
		searchProvider.AddFilter(search.FilterData(*collection.ListRule))
	}

	users := []*models.Record{}
	_, err = searchProvider.ParseAndExec(queryParams.Encode(), &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}
