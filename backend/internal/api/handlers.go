package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/mroglan/bookearth/backend/internal/model"
)

type errorResponse struct {
	Error string `json:"error"`
}

type healthResponse struct {
	Status string `json:"status"`
	DB     string `json:"db"`
}

type eventsResponse struct {
	Events []model.Event `json:"events"`
}

func (a *API) handleHealth(w http.ResponseWriter, r *http.Request) {
	if err := a.healthRepo.Check(r.Context()); err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	writeJSON(w, http.StatusOK, healthResponse{Status: "ok", DB: "ok"})
}

func (a *API) handleBookEvents(w http.ResponseWriter, r *http.Request, bookID string) {
	if strings.TrimSpace(bookID) == "" {
		writeError(w, http.StatusBadRequest, "book id is required")
		return
	}

	events, err := a.eventsRepo.FetchByBook(r.Context(), bookID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	writeJSON(w, http.StatusOK, eventsResponse{Events: events})
}

func (a *API) handleBookMapComposition(w http.ResponseWriter, r *http.Request, bookID string) {
	if strings.TrimSpace(bookID) == "" {
		writeError(w, http.StatusBadRequest, "book id is required")
		return
	}

	composition, found, err := a.booksRepo.FetchMapCompositionByBook(r.Context(), bookID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	if !found {
		writeError(w, http.StatusNotFound, "book not found")
		return
	}

	writeJSON(w, http.StatusOK, composition)
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, errorResponse{Error: message})
}
