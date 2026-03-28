package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"

	"github.com/mroglan/bookearth/backend/internal/config"
	"github.com/mroglan/bookearth/backend/internal/model"
	"github.com/mroglan/bookearth/backend/internal/repository"
)

type API struct {
	healthRepo model.HealthRepository
	booksRepo  model.BookRepository
	eventsRepo model.EventRepository
}

func NewAPI(conn repository.Connection) *API {
	return &API{
		healthRepo: repository.NewPostgresHealthRepository(conn),
		booksRepo:  repository.NewPostgresBookRepository(conn),
		eventsRepo: repository.NewPostgresEventRepository(conn),
	}
}

func (a *API) Server() *http.Server {
	r := chi.NewRouter()
	r.Use(CORS)
	handler := a.registerRoutes(r)
	cfg := config.LoadConfig()
	return &http.Server{
		Addr:              fmt.Sprintf(":%d", cfg.Port),
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}
}
