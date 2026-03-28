package repository

import (
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5"

	"github.com/mroglan/bookearth/backend/internal/model"
)

type PostgresBookRepository struct {
	conn Connection
}

func NewPostgresBookRepository(conn Connection) *PostgresBookRepository {
	return &PostgresBookRepository{conn: conn}
}

func (r *PostgresBookRepository) GetMapCompositionById(
	ctx context.Context,
	bookID string,
) (model.MapComposition, error) {
	row := r.conn.QueryRow(
		ctx,
		"SELECT map_composition FROM books WHERE id = $1 LIMIT 1;",
		bookID,
	)

	var raw []byte
	if err := row.Scan(&raw); err != nil {
		if err == pgx.ErrNoRows {
			return model.MapComposition{}, model.ErrNotFound
		}
		return model.MapComposition{}, err
	}

	var composition model.MapComposition
	if len(raw) > 0 {
		if err := json.Unmarshal(raw, &composition); err != nil {
			return model.MapComposition{}, err
		}
	}

	return composition, nil
}
