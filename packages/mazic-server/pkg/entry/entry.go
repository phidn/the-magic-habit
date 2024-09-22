package entry

import (
	"math"
	"mazic/pocketbase/daos"
	"mazic/pocketbase/models"
	"mazic/server/config"
	"mazic/server/pkg/infrastructure"
	"mazic/server/pkg/schema"
	"net/url"
	"strconv"

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

func (entry *Entry) ModelQuery(m models.Model) *dbx.SelectQuery {
	tableName := m.TableName()
	return entry.Dao().DB().
		Select("{{" + tableName + "}}.*").
		From(tableName)
}

func (entry *Entry) Find(records interface{}, modelQuery *dbx.SelectQuery, queryParams url.Values) (*schema.ResultPagination, error) {
	result := &schema.ResultPagination{}
	if err := entry.Parse(queryParams, result); err != nil {
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

	err := modelQuery.
		Limit(int64(result.PageSize)).
		Offset(int64((result.Page - 1) * result.PageSize)).
		All(records)
	if err != nil {
		return nil, err
	}

	result.Items = records
	return result, nil
}

func (entry *Entry) Parse(queryParams url.Values, result *schema.ResultPagination) error {
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
