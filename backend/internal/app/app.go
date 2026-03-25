package app

import (
	"github.com/go-chi/chi/v5"

	"bookearth/backend/internal/config"
	"bookearth/backend/internal/middleware"
	"bookearth/backend/internal/routes"
)

func New(cfg config.Config) *chi.Mux {
	r := chi.NewRouter()
	r.Use(middleware.CORS)
	routes.Register(r)
	return r
}
