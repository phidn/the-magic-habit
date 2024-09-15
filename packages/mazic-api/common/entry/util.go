package entry_common

import (
	"regexp"
	"mazic/mazicapi/pkg/valid_pointer"
	"strings"

	"gorm.io/gorm"
)

func ApplyQueryOptions(db *gorm.DB, opts *QueryOptions) *gorm.DB {
	if opts == nil {
		return db
	}
	if len(opts.SelectFields) > 0 {
		db = db.Select(opts.SelectFields)
	}
	if len(opts.OmitFields) > 0 {
		db = db.Omit(opts.OmitFields...)
	}
	return db
}

func ApplyFilters(query *gorm.DB, filter *Filters) *gorm.DB {
	if filter == nil {
		return query
	}
	if filter.Search != nil {
		for key, value := range filter.Search {
			if strValue, ok := value.(*string); ok && valid_pointer.String(strValue) != "" {
				query = query.Where(key+" ILIKE ?", "%"+valid_pointer.String(strValue)+"%")
			}
		}
	}
	if filter.Filters != nil {
		for key, value := range filter.Filters {
			if strValue, ok := value.(*string); ok && valid_pointer.String(strValue) != "" {
				query = query.Where(key+" = ?", valid_pointer.String(strValue))
			}
			if boolValue, ok := value.(*bool); ok && boolValue != nil {
				query = query.Where(key+" = ?", boolValue)
			}
		}
	}
	if len(filter.SelectFields) > 0 {
		query = query.Select(filter.SelectFields)
	}
	if len(filter.OmitFields) > 0 {
		query = query.Omit(filter.OmitFields...)
	}
	if len(filter.PreloadFields) > 0 {
		for _, field := range filter.PreloadFields {
			query = query.Preload(field)
		}
	}
	return query
}

func ApplySort(query *gorm.DB, sort *string, defaultOrder string) *gorm.DB {
	if sort != nil {
		parts := strings.Split(*sort, ":")
		if len(parts) == 2 {
			return query.Order(parts[0] + " " + parts[1])
		}
	}
	if sort == nil && defaultOrder != "" {
		return query.Order(defaultOrder)
	}
	return query
}

func ValidateMimeType(mimeType string, allowedMimeRegex []string) bool {
	for _, regex := range allowedMimeRegex {
		if !regexp.MustCompile(regex).MatchString(mimeType) {
			return false
		}
	}
	return true
}
