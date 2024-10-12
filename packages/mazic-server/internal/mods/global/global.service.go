package global

import (
	"context"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/infrastructure"
	"github.com/golangthang/mazic-habit/pkg/supa_storage"
	"github.com/golangthang/mazic-habit/pkg/utils"
	"github.com/golangthang/mazic-habit/pkg/valid_pointer"

	"github.com/pocketbase/dbx"
)

type GlobalService interface {
	ListOptions(ctx context.Context, resource ResourceOption) ([]Option, error)
	Upload(file *multipart.FileHeader) (string, error)
}

type globalService struct {
	Entry   entry.Entry
	Storage *infrastructure.SupaStorage
}

func NewGlobalService(entry entry.Entry, storage *infrastructure.SupaStorage) GlobalService {
	return &globalService{
		Entry:   entry,
		Storage: storage,
	}
}

func (service *globalService) ListOptions(ctx context.Context, resource ResourceOption) ([]Option, error) {
	options := []Option{}

	fieldValue := utils.If(resource.FieldValue == "", "id", resource.FieldValue)
	fieldLabel := utils.If(resource.FieldLabel == "", "name", resource.FieldLabel)
	fieldOrder := utils.If(resource.OrderBy == "", fieldLabel, resource.OrderBy)

	selectStrings := []string{
		fmt.Sprintf(`%s as value`, fieldValue),
		fmt.Sprintf(`%s as label`, fieldLabel),
	}
	if len(resource.ExtraFields) > 0 {
		for _, field := range resource.ExtraFields {
			selectStrings = append(selectStrings, fmt.Sprintf(`%s as %s`, field, field))
		}
	}

	query := service.Entry.Dao().DB().
		Select(selectStrings...).
		WithContext(ctx).
		From(resource.Table).
		OrderBy(fmt.Sprintf(`%s ASC`, fieldOrder))

	if resource.Limit > 0 {
		query = query.Limit(resource.Limit)
	}
	if resource.SearchKeyword != "" {
		searchFields := utils.If(len(resource.SearchFields) == 0, []string{"name"}, resource.SearchFields)
		conditions := []dbx.Expression{}
		for _, field := range searchFields {
			conditions = append(conditions, dbx.Like(field, resource.SearchKeyword))
		}
		query = query.Where(dbx.Or(conditions...))
	}

	if err := query.All(&options); err != nil {
		return nil, err
	}

	return options, nil
}

func (service *globalService) Upload(file *multipart.FileHeader) (string, error) {
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

	// TODO: only allow image & svg
	isAllowed := validateMimeType(mimetype, "image/*")

	if !isAllowed {
		return "", errors.New("file type not allowed")
	}

	_, err = fileData.Seek(0, io.SeekStart)
	if err != nil {
		return "", err
	}

	filePath := fmt.Sprintf("%s-%s", utils.RandomString(), file.Filename)

	_, err = service.Storage.UploadFile(service.Storage.Bucket, filePath, fileData, supa_storage.FileOptions{
		ContentType: valid_pointer.PointerString(mimetype),
	})
	if err != nil {
		return "", err
	}
	publicFile := service.Storage.GetPublicUrl(service.Storage.Bucket, filePath)
	return publicFile.SignedURL, nil
}
