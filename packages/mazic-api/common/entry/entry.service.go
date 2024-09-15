package entry_common

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"mazic/mazicapi/cmd/infrastructure"
	"mazic/mazicapi/pkg/errors"
	"mazic/mazicapi/pkg/storages/supabase_storage"
	"mazic/mazicapi/util"

	"gorm.io/gorm"
)

type EntryService struct {
	Database *infrastructure.Database
	Storage  *infrastructure.Storage
}

func NewEntryService(db *infrastructure.Database, storage *infrastructure.Storage) *EntryService {
	return &EntryService{
		Database: db,
		Storage:  storage,
	}
}

func (service *EntryService) DB(ctx context.Context) *gorm.DB {
	return service.Database.GetContext(ctx)
}

func (service *EntryService) GetById(ctx context.Context, result interface{}, id string, filters *Filters) error {
	db := service.Database.GetContext(ctx)
	db = ApplyFilters(db, filters)
	return db.Where("id = ?", id).First(result).Error
}

func (service *EntryService) Create(ctx context.Context, payload interface{}) error {
	db := service.Database.GetContext(ctx).Model(payload)
	return db.Create(payload).Error
}

func (service *EntryService) Update(ctx context.Context, id string, payload interface{}, filters *Filters) error {
	db := service.Database.GetContext(ctx).Model(payload)
	db = ApplyFilters(db, filters)
	return db.Where("id = ?", id).Updates(payload).Error
}

func (service *EntryService) Save(ctx context.Context, payload interface{}, filters *Filters) error {
	db := service.Database.GetContext(ctx).Model(payload)
	db = ApplyFilters(db, filters)
	return db.Save(payload).Error
}

func (service *EntryService) Delete(ctx context.Context, id string, model interface{}) error {
	return service.Database.GetContext(ctx).Where("id = ?", id).Delete(model).Error
}

func (service *EntryService) DeleteNotIn(ctx context.Context, model interface{}, column string, ids []string) error {
	db := service.Database.GetContext(ctx)
	return db.Where("? NOT IN (?)", column, ids).Delete(model).Error
}

func (service *EntryService) GetList(ctx context.Context, result interface{}, pagination util.PaginationPage, filters *Filters) (int64, error) {
	db := service.Database.GetContext(ctx).Model(result)

	db = ApplyFilters(db, filters)
	db = ApplySort(db, filters.Sort, "created_at DESC")

	var total int64
	if err := db.Count(&total).Error; err != nil {
		return 0, err
	}

	db = db.
		Limit(pagination.PageSize).
		Offset((pagination.Page - 1) * pagination.PageSize)

	if err := db.Find(result).Error; err != nil {
		return 0, err
	}

	return total, nil
}

func (service *EntryService) GetOptions(ctx context.Context, table string, fields []string) ([]EntryOption, error) {
	var options []EntryOption

	db := service.Database.
		GetContext(ctx).
		Table(table).
		Select(fmt.Sprintf(`%s as value, %s as label`, fields[0], fields[1]))

	if err := db.Find(&options).Error; err != nil {
		return nil, err
	}

	return options, nil
}

func (service *EntryService) Upload(ctx context.Context, file *multipart.FileHeader) (string, error) {
	fileData, err := file.Open()
	if err != nil {
		return "", err
	}
	defer fileData.Close()

	buff := make([]byte, 512)
	_, err = fileData.Read(buff)
	if err != nil {
		return "", err
	}

	mimetype := http.DetectContentType(buff)
	isAllowed := ValidateMimeType(mimetype, allowedMimeRegex)
	if !isAllowed {
		return "", errors.BadRequest("", "file type not allowed")
	}

	_, err = fileData.Seek(0, io.SeekStart)
	if err != nil {
		return "", err
	}

	filePath := fmt.Sprintf("%s-%s", util.NewUuid(), file.Filename)
	_, err = service.Storage.UploadFile(service.Storage.Bucket, filePath, fileData, supabase_storage.FileOptions{
		ContentType: &mimetype,
	})
	if err != nil {
		return "", err
	}
	publicFile := service.Storage.GetPublicUrl(service.Storage.Bucket, filePath)
	return publicFile.SignedURL, nil
}
