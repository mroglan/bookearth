package api

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"

	"github.com/mroglan/bookearth/backend/internal/db"
)

func TestHealthEndpoint(t *testing.T) {
	client, baseURL := newTestServer(t)

	resp, err := client.Get(baseURL + "/health")
	if err != nil {
		t.Fatalf("health request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}
	var health healthResponse
	if err := json.NewDecoder(resp.Body).Decode(&health); err != nil {
		t.Fatalf("decode health response: %v", err)
	}
	_ = resp.Body.Close()
	if health.Status != "ok" || health.DB != "ok" {
		t.Fatalf("unexpected health response: %+v", health)
	}
}

func TestBookEventsEndpoint(t *testing.T) {
	client, baseURL := newTestServer(t)

	resp, err := client.Get(baseURL + "/books/1/events")
	if err != nil {
		t.Fatalf("events request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}
	var events eventsResponse
	if err := json.NewDecoder(resp.Body).Decode(&events); err != nil {
		t.Fatalf("decode events response: %v", err)
	}
	_ = resp.Body.Close()
	if len(events.Events) == 0 {
		t.Fatalf("expected events to be non-empty")
	}
}

func TestBookMapCompositionEndpoint(t *testing.T) {
	client, baseURL := newTestServer(t)

	resp, err := client.Get(baseURL + "/books/1/map-composition")
	if err != nil {
		t.Fatalf("map composition request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}
	var composition map[string]any
	if err := json.NewDecoder(resp.Body).Decode(&composition); err != nil {
		t.Fatalf("decode map composition response: %v", err)
	}
	_ = resp.Body.Close()
	if _, ok := composition["base"]; !ok {
		t.Fatalf("expected map composition to include base")
	}
}

func newTestServer(t *testing.T) (*http.Client, string) {
	t.Helper()
	ctx := context.Background()
	pool, err := db.CreatePostgresConnection(ctx)
	if err != nil {
		t.Fatalf("failed to create db pool: %v", err)
	}
	t.Cleanup(pool.Close)

	api := NewAPI(pool)
	r := chi.NewRouter()
	r.Use(CORS)
	handler := api.registerRoutes(r)

	srv := httptest.NewServer(handler)
	t.Cleanup(srv.Close)

	return srv.Client(), srv.URL
}
