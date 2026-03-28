package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"

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

func (a *API) Handler() http.Handler {
	r := chi.NewRouter()
	r.Use(CORS)
	return a.registerRoutes(r)
}
