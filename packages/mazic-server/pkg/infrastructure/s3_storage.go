package infrastructure

import (
	"context"
	"errors"
	"fmt"
	"image"
	"net/http"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/disintegration/imaging"
	"github.com/gabriel-vasile/mimetype"
	"github.com/golangthang/mazic-habit/config"
	"github.com/golangthang/mazic-habit/pkg/s3_lite"
	"github.com/golangthang/mazic-habit/pkg/utils"
	"gocloud.dev/blob"
)

type S3Storage struct {
	*blob.Bucket
	ctx context.Context
}

func NewS3Storage() *S3Storage {
	fmt.Println("🚀 Connecting to S3 Storage...")

	bucketName := config.Config.S3Bucket
	region := config.Config.S3Region
	endpoint := config.Config.S3Endpoint
	accessKey := config.Config.S3AccessKey
	secretKey := config.Config.S3SecretKey

	cred := credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")

	ctx := context.Background()
	cfg, err := awsConfig.LoadDefaultConfig(
		ctx,
		awsConfig.WithCredentialsProvider(cred),
		awsConfig.WithRegion(region),
	)
	if err != nil {
		fmt.Println("Error loading AWS config", err)
		return nil
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		if !strings.Contains(endpoint, "://") {
			endpoint = "https://" + endpoint
		}
		o.BaseEndpoint = aws.String(endpoint)
		o.UsePathStyle = false
	})

	bucket, err := s3_lite.OpenBucketV2(ctx, client, bucketName, nil)
	if err != nil {
		fmt.Println("Error opening bucket", err)
		return nil
	}

	fmt.Println("🚀 Successfully connected to S3 Storage")
	return &S3Storage{bucket, ctx}
}

// SetContext assigns the specified context to the current filesystem.
func (s *S3Storage) SetContext(ctx context.Context) {
	s.ctx = ctx
}

func (s *S3Storage) GetContext() context.Context {
	return s.ctx
}

func (s *S3Storage) Upload(content []byte, fileKey string) error {
	opts := &blob.WriterOptions{
		ContentType: mimetype.Detect(content).String(),
	}

	w, writerErr := s.NewWriter(s.ctx, fileKey, opts)
	if writerErr != nil {
		return writerErr
	}

	if _, err := w.Write(content); err != nil {
		w.Close()
		return err
	}

	return w.Close()
}

var ThumbSizeRegex = regexp.MustCompile(`^(\d+)x(\d+)(t|b|f)?$`)

func (s *S3Storage) CreateThumb(originalKey string, thumbKey, thumbSize string) error {
	sizeParts := ThumbSizeRegex.FindStringSubmatch(thumbSize)
	if len(sizeParts) != 4 {
		return errors.New("thumb size must be in WxH, WxHt, WxHb or WxHf format")
	}

	width, _ := strconv.Atoi(sizeParts[1])
	height, _ := strconv.Atoi(sizeParts[2])
	resizeType := sizeParts[3]

	if width == 0 && height == 0 {
		return errors.New("thumb width and height cannot be zero at the same time")
	}

	// fetch the original
	r, readErr := s.NewReader(s.ctx, originalKey, nil)
	if readErr != nil {
		return readErr
	}
	defer r.Close()

	// create imaging object from the original reader
	// (note: only the first frame for animated image formats)
	img, decodeErr := imaging.Decode(r, imaging.AutoOrientation(true))
	if decodeErr != nil {
		return decodeErr
	}

	var thumbImg *image.NRGBA

	if width == 0 || height == 0 {
		// force resize preserving aspect ratio
		thumbImg = imaging.Resize(img, width, height, imaging.Linear)
	} else {
		switch resizeType {
		case "f":
			// fit
			thumbImg = imaging.Fit(img, width, height, imaging.Linear)
		case "t":
			// fill and crop from top
			thumbImg = imaging.Fill(img, width, height, imaging.Top, imaging.Linear)
		case "b":
			// fill and crop from bottom
			thumbImg = imaging.Fill(img, width, height, imaging.Bottom, imaging.Linear)
		default:
			// fill and crop from center
			thumbImg = imaging.Fill(img, width, height, imaging.Center, imaging.Linear)
		}
	}

	opts := &blob.WriterOptions{
		ContentType: r.ContentType(),
	}

	// open a thumb storage writer (aka. prepare for upload)
	w, writerErr := s.NewWriter(s.ctx, thumbKey, opts)
	if writerErr != nil {
		return writerErr
	}

	// try to detect the thumb format based on the original file name
	// (fallbacks to png on error)
	format, err := imaging.FormatFromFilename(thumbKey)
	if err != nil {
		format = imaging.PNG
	}

	// thumb encode (aka. upload)
	if err := imaging.Encode(w, thumbImg, format); err != nil {
		w.Close()
		return err
	}

	// check for close errors to ensure that the thumb was really saved
	return w.Close()
}

func (s *S3Storage) GetFile(fileKey string) (*blob.Reader, error) {
	br, err := s.NewReader(s.ctx, fileKey, nil)
	if err != nil {
		return nil, err
	}

	return br, nil
}

func (s *S3Storage) Serve(res http.ResponseWriter, req *http.Request, fileKey string, name string) error {
	br, readErr := s.NewReader(s.ctx, fileKey, nil)
	if readErr != nil {
		return readErr
	}
	defer br.Close()

	var forceAttachment bool
	if raw := req.URL.Query().Get(forceAttachmentParam); raw != "" {
		forceAttachment, _ = strconv.ParseBool(raw)
	}

	disposition := "attachment"
	realContentType := br.ContentType()
	if !forceAttachment && utils.ExistInSlice(realContentType, inlineServeContentTypes) {
		disposition = "inline"
	}

	// make an exception for specific content types and force a custom
	// content type to send in the response so that it can be loaded properly
	extContentType := realContentType
	if ct, found := manualExtensionContentTypes[filepath.Ext(name)]; found && extContentType != ct {
		extContentType = ct
	}

	setHeaderIfMissing(res, "Content-Disposition", disposition+"; filename="+name)
	setHeaderIfMissing(res, "Content-Type", extContentType)
	setHeaderIfMissing(res, "Content-Security-Policy", "default-src 'none'; media-src 'self'; style-src 'unsafe-inline'; sandbox")

	// set a default cache-control header
	// (valid for 30 days but the cache is allowed to reuse the file for any requests
	// that are made in the last day while revalidating the res in the background)
	setHeaderIfMissing(res, "Cache-Control", "max-age=2592000, stale-while-revalidate=86400")

	http.ServeContent(res, req, name, br.ModTime(), br)

	return nil
}

func setHeaderIfMissing(res http.ResponseWriter, key string, value string) {
	if _, ok := res.Header()[key]; !ok {
		res.Header().Set(key, value)
	}
}

var manualExtensionContentTypes = map[string]string{
	".svg": "image/svg+xml", // (see https://github.com/whatwg/mimesniff/issues/7)
	".css": "text/css",      // (see https://github.com/gabriel-vasile/mimetype/pull/113)
}

var inlineServeContentTypes = []string{
	// image
	"image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp", "image/x-icon", "image/bmp",
	// video
	"video/webm", "video/mp4", "video/3gpp", "video/quicktime", "video/x-ms-wmv",
	// audio
	"audio/basic", "audio/aiff", "audio/mpeg", "audio/midi", "audio/mp3", "audio/wave",
	"audio/wav", "audio/x-wav", "audio/x-mpeg", "audio/x-m4a", "audio/aac",
	// document
	"application/pdf", "application/x-pdf",
}

const forceAttachmentParam = "download"
