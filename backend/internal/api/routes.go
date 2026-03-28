package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (a *API) registerRoutes(r *chi.Mux) http.Handler {
	r.Get("/health", a.handleHealth)
	r.Get("/books/{id}/events", func(w http.ResponseWriter, req *http.Request) {
		a.handleBookEvents(w, req, chi.URLParam(req, "id"))
	})
	r.Get("/books/{id}/map-composition", func(w http.ResponseWriter, req *http.Request) {
		a.handleBookMapComposition(w, req, chi.URLParam(req, "id"))
	})

	return r
}
