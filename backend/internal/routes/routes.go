package routes

import (
	"github.com/go-chi/chi/v5"

	"bookearth/backend/internal/controllers"
)

func Register(r *chi.Mux) {
	r.Get("/health", controllers.Health)
}
