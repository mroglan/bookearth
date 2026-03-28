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
) (model.MapComposition, bool, error) {
	row := r.conn.QueryRow(
		ctx,
		"SELECT map_composition FROM books WHERE id = $1 LIMIT 1;",
		bookID,
	)

	var raw []byte
	if err := row.Scan(&raw); err != nil {
		if err == pgx.ErrNoRows {
			return nil, false, nil
		}
		return nil, false, err
	}

	if len(raw) == 0 {
		return model.MapComposition{}, true, nil
	}

	var composition model.MapComposition
	if err := json.Unmarshal(raw, &composition); err != nil {
		return nil, false, err
	}

	return composition, true, nil
}
