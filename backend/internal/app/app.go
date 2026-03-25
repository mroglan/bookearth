package app

import (
	"net/http"

	"bookearth/backend/internal/config"
	"bookearth/backend/internal/middleware"
	"bookearth/backend/internal/routes"
)

func New(cfg config.Config) http.Handler {
	r := routes.NewRouter()
	return middleware.CORS(cfg.CORS)(r)
}
