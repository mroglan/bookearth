package routes

import (
	"net/http"

	"bookearth/backend/internal/controllers"

	"github.com/go-chi/chi/v5"
)

func NewRouter() http.Handler {
	r := chi.NewRouter()

	r.Get("/health", controllers.Health)

	return r
}
