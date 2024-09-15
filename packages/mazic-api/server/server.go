package server

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"runtime"
	"mazic/mazicapi/pkg/pretty_logger"
	"mazic/mazicapi/server/config"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Server struct {
	Version   string
	validator *validator.Validate
	Echo      *echo.Echo
}

func NewServer() *Server {
	server := &Server{
		Version:   "1.0.0",
		validator: validator.New(),
		Echo:      echo.New(),
	}
	err := config.Config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}
	server.Init()
	return server
}

func (s *Server) Init() {
	s.Echo.HideBanner = true
	s.Echo.HidePort = true
	s.Echo.Use(middleware.CORSWithConfig(middleware.CORSConfig{ // This will skip all logging
		AllowOrigins: []string{"http://localhost:4200"},
	}))
	s.Echo.Logger.SetOutput(io.Discard)

	go func() {
		if err := s.Start(config.Config.Port); err != nil && err != http.ErrServerClosed {
			fmt.Printf("Error starting server: %v\n", err)
		}
	}()

	data := [][]string{
		{"env", config.Config.Env},
		{"golang", runtime.Version()},
		{"server", "http://localhost:" + config.Config.Port},
		{"swagger", "http://localhost:" + config.Config.Port + "/swagger/index.html"},
		{"time", time.Now().Format("15:04:05 02/01/2006")},
	}

	pretty_logger.PrintTable(data, false)

}

func (s *Server) Start(addr string) error {
	return s.Echo.Start(":" + addr)
}
