package entry

import (
	"context"
	"math"
	"mazic/pocketbase/daos"
	"mazic/pocketbase/models"
	"mazic/server/config"
	"mazic/server/pkg/infrastructure"
	"mazic/server/pkg/schema"
	"net/url"
	"strconv"
	"strings"

	"github.com/pocketbase/dbx"
)

type Entry struct {
	App *infrastructure.Pocket
}

func NewEntry(app *infrastructure.Pocket) *Entry {
	return &Entry{
		App: app,
	}
}

func (entry *Entry) Dao() *daos.Dao {
	return entry.App.Dao()
}

func (entry *Entry) ModelQuery(ctx context.Context, m models.Model) *dbx.SelectQuery {
	tableName := m.TableName()
	return entry.Dao().DB().
		Select("{{" + tableName + "}}.*").
		WithContext(ctx).
		From(tableName)
}

func (entry *Entry) Find(ctx context.Context, slices any, expressions []dbx.Expression, queryParams url.Values) (*schema.ListItems, error) {
	model, err := entry.getModelFromSlice(slices)
	if err != nil {
		return nil, err
	}
	modelQuery := entry.ModelQuery(ctx, model)
	for _, exp := range expressions {
		modelQuery = modelQuery.AndWhere(exp)
	}

	result := &schema.ListItems{}
	if err := entry.ParsePagination(queryParams, result); err != nil {
		return nil, err
	}

	countQuery := *modelQuery
	if err := countQuery.Select("COUNT(1)").Row(&result.Total); err != nil {
		return nil, err
	}

	// no records found
	if result.Total == 0 {
		return result, nil
	}

	// this case for no pagination: pageSize = 0, -1, ...
	if result.PageSize > 0 {
		result.PageCount = int(math.Ceil(float64(result.Total) / float64(result.PageSize)))
		if result.Page > result.PageCount {
			return result, nil
		}
	} else {
		result.PageCount = 1
	}

	isValidSort, column, direction := entry.ValidateSort(model, queryParams)
	if isValidSort {
		modelQuery.OrderBy(column + " " + direction)
	}

	err = modelQuery.
		Limit(int64(result.PageSize)).
		Offset(int64((result.Page - 1) * result.PageSize)).
		All(slices)
	if err != nil {
		return nil, err
	}

	result.Items = slices
	return result, nil
}

func (entry *Entry) FindCollectionByName(ctx context.Context, name string) (*models.Collection, error) {
	model := &models.Collection{}

	err := entry.ModelQuery(ctx, model).
		AndWhere(dbx.NewExp("LOWER([[name]])={:name}", dbx.Params{
			"name": strings.ToLower(name),
		})).
		Limit(1).
		One(model)

	if err != nil {
		return nil, err
	}

	return model, nil
}

func (entry *Entry) FindRecordById(ctx context.Context, name string, id string) (*models.Record, error) {
	collection, err := entry.FindCollectionByName(ctx, name)
	if err != nil {
		return nil, err
	}
	query := entry.Dao().RecordQuery(collection).
		WithContext(ctx).
		AndWhere(dbx.HashExp{collection.Name + ".id": id})

	record := &models.Record{}
	if err := query.Limit(1).One(record); err != nil {
		return nil, err
	}

	return record, nil
}

func (entry *Entry) ParsePagination(queryParams url.Values, result *schema.ListItems) error {
	params, err := url.ParseQuery(queryParams.Encode())
	if err != nil {
		return err
	}
	if raw := params.Get("pageSize"); raw != "" {
		v, err := strconv.Atoi(raw)
		if err != nil {
			return err
		}
		result.PageSize = v
	}
	if raw := params.Get("page"); raw != "" {
		v, err := strconv.Atoi(raw)
		if err != nil {
			return err
		}
		result.Page = v
	}
	if result.PageSize > config.MaxPageSize || result.PageSize == 0 {
		result.PageSize = config.DefaultPageSize
	}
	if result.Page < 1 {
		result.Page = 1
	}
	return nil
}

// validates the sort query parameter: sort=name:ASC
func (entry *Entry) ValidateSort(m models.Model, queryParams url.Values) (bool, string, string) {
	collection, err := entry.Dao().FindCollectionByNameOrId(m.TableName())
	if err != nil {
		return false, "", ""
	}

	sort := queryParams.Get("sort")
	if sort == "" {
		return false, "", ""
	}

	parts := strings.Split(sort, ":")
	if len(parts) != 2 {
		return false, "", ""
	}

	column := parts[0]
	field := collection.Schema.GetFieldByName(column)
	if field == nil {
		return false, "", ""
	}

	direction := strings.ToUpper(parts[1])
	if direction != "ASC" && direction != "DESC" {
		return false, "", ""
	}

	return true, column, direction
}
