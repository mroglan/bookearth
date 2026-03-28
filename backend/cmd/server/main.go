package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/mroglan/bookearth/backend/internal/api"
	"github.com/mroglan/bookearth/backend/internal/config"
	"github.com/mroglan/bookearth/backend/internal/db"
)

func main() {
	ctx := context.Background()
	pool, err := db.CreatePostgresConnection(ctx)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to create db pool: %v\n", err)
		os.Exit(1)
	}
	defer pool.Close()

	waitCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	if err := db.WaitForConnection(waitCtx, pool, 10, time.Second); err != nil {
		fmt.Fprintf(os.Stderr, "failed to connect to database: %v\n", err)
		os.Exit(1)
	}

	app := api.NewAPI(pool)
	server := app.Server()

	shutdownCh := make(chan os.Signal, 1)
	signal.Notify(shutdownCh, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-shutdownCh
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		_ = server.Shutdown(ctx)
	}()

	cfg := config.LoadConfig()
	fmt.Printf("Book Earth API listening on http://localhost:%d\n", cfg.Port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		fmt.Fprintf(os.Stderr, "server error: %v\n", err)
		os.Exit(1)
	}
}
