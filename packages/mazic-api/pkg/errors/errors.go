package errors

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/pkg/errors"
)

// Define alias
var (
	WithStack = errors.WithStack
	Wrap      = errors.Wrap
	Wrapf     = errors.Wrapf
	Is        = errors.Is
	Errorf    = errors.Errorf
)

const (
	DefaultBadRequestID            = "BAD_REQUEST"
	DefaultUnauthorizedID          = "UNAUTHORIZED"
	DefaultForbiddenID             = "FORBIDDEN"
	DefaultNotFoundID              = "NOT_FOUND"
	DefaultMethodNotAllowedID      = "METHOD_NOT_ALLOWED"
	DefaultTooManyRequestsID       = "TOO_MANY_REQUESTS"
	DefaultRequestEntityTooLargeID = "REQUEST_ENTITY_TOO_LARGE"
	DefaultInternalServerErrorID   = "INTERNAL_SERVER_ERROR"
	DefaultConflictID              = "CONFLICT"
	DefaultRequestTimeoutID        = "REQUEST_TIMEOUT"
)

// Customize the error structure for implementation errors.Error interface
type Error struct {
	Name     string `json:"name,omitempty"`
	StatusCode   int32  `json:"code,omitempty"`
	Message string `json:"message,omitempty"`
}

func (e *Error) Error() string {
	b, _ := json.Marshal(e)
	return string(b)
}

// New generates a custom error.
func New(name, message string, code int32) error {
	return &Error{
		Name:     name,
		StatusCode:   code,
		Message: message,
	}
}

// Parse tries to parse a JSON string into an error. If that
// fails, it will set the given string as the error Message.
func Parse(err string) *Error {
	e := new(Error)
	errr := json.Unmarshal([]byte(err), e)
	if errr != nil {
		e.Message = err
	}
	return e
}

// BadRequest generates a 400 error.
func BadRequest(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultBadRequestID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusBadRequest,
		Message: fmt.Sprintf(format, a...),
	}
}

// Unauthorized generates a 401 error.
func Unauthorized(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultUnauthorizedID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusUnauthorized,
		Message: fmt.Sprintf(format, a...),
	}
}

// Forbidden generates a 403 error.
func Forbidden(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultForbiddenID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusForbidden,
		Message: fmt.Sprintf(format, a...),
	}
}

// NotFound generates a 404 error.
func NotFound(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultNotFoundID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusNotFound,
		Message: fmt.Sprintf(format, a...),
	}
}

// MethodNotAllowed generates a 405 error.
func MethodNotAllowed(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultMethodNotAllowedID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusMethodNotAllowed,
		Message: fmt.Sprintf(format, a...),
	}
}

// TooManyRequests generates a 429 error.
func TooManyRequests(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultTooManyRequestsID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusTooManyRequests,
		Message: fmt.Sprintf(format, a...),
	}
}

// Timeout generates a 408 error.
func Timeout(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultRequestTimeoutID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusRequestTimeout,
		Message: fmt.Sprintf(format, a...),
	}
}

// Conflict generates a 409 error.
func Conflict(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultConflictID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusConflict,
		Message: fmt.Sprintf(format, a...),
	}
}

// RequestEntityTooLarge generates a 413 error.
func RequestEntityTooLarge(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultRequestEntityTooLargeID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusRequestEntityTooLarge,
		Message: fmt.Sprintf(format, a...),
	}
}

// InternalServerError generates a 500 error.
func InternalServerError(name, format string, a ...interface{}) error {
	if name == "" {
		name = DefaultInternalServerErrorID
	}
	return &Error{
		Name:     name,
		StatusCode:   http.StatusInternalServerError,
		Message: fmt.Sprintf(format, a...),
	}
}

// Equal tries to compare errors
func Equal(err1 error, err2 error) bool {
	verr1, ok1 := err1.(*Error)
	verr2, ok2 := err2.(*Error)

	if ok1 != ok2 {
		return false
	}

	if !ok1 {
		return err1 == err2
	}

	if verr1.StatusCode != verr2.StatusCode {
		return false
	}

	return true
}

// FromError try to convert go error to *Error
func FromError(err error) *Error {
	if err == nil {
		return nil
	}
	if verr, ok := err.(*Error); ok && verr != nil {
		return verr
	}

	return Parse(err.Error())
}

// As finds the first error in err's chain that matches *Error
func As(err error) (*Error, bool) {
	if err == nil {
		return nil, false
	}
	var merr *Error
	if errors.As(err, &merr) {
		return merr, true
	}
	return nil, false
}

type MultiError struct {
	lock   *sync.Mutex
	Errors []error
}

func NewMultiError() *MultiError {
	return &MultiError{
		lock:   &sync.Mutex{},
		Errors: make([]error, 0),
	}
}

func (e *MultiError) Append(err error) {
	e.Errors = append(e.Errors, err)
}

func (e *MultiError) AppendWithLock(err error) {
	e.lock.Lock()
	defer e.lock.Unlock()
	e.Append(err)
}

func (e *MultiError) HasErrors() bool {
	return len(e.Errors) > 0
}

func (e *MultiError) Error() string {
	b, _ := json.Marshal(e)
	return string(b)
}
