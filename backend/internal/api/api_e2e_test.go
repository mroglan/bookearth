package api

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/mroglan/bookearth/backend/internal/db"
)

var (
	testClient *http.Client
	baseURL    string
)

func TestMain(m *testing.M) {
	ctx := context.Background()
	pool, err := db.CreatePostgresConnection(ctx)
	if err != nil {
		panic(err)
	}
	defer pool.Close()

	api := NewAPI(pool)
	handler := api.Handler()

	srv := httptest.NewServer(handler)
	defer srv.Close()

	testClient = srv.Client()
	baseURL = srv.URL

	exitCode := m.Run()
	os.Exit(exitCode)
}

func TestHealthEndpoint(t *testing.T) {
	resp, err := testClient.Get(baseURL + "/health")
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
	resp, err := testClient.Get(baseURL + "/books/1/events")
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
	resp, err := testClient.Get(baseURL + "/books/1/map-composition")
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
