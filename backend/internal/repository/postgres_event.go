package repository

import (
	"context"

	"github.com/mroglan/bookearth/backend/internal/model"
)

type PostgresEventRepository struct {
	conn Connection
}

func NewPostgresEventRepository(conn Connection) *PostgresEventRepository {
	return &PostgresEventRepository{conn: conn}
}

func (r *PostgresEventRepository) FetchByBook(ctx context.Context, bookID string) ([]model.Event, error) {
	rows, err := r.conn.Query(
		ctx,
		`SELECT id, book_id, parent_event_id, title, description, lat, lon, importance, narrative_index
		 FROM events
		 WHERE book_id = $1
		 ORDER BY narrative_index NULLS LAST, id`,
		bookID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := []model.Event{}
	for rows.Next() {
		var event model.Event
		if err := rows.Scan(
			&event.ID,
			&event.BookID,
			&event.ParentEventID,
			&event.Title,
			&event.Description,
			&event.Lat,
			&event.Lon,
			&event.Importance,
			&event.NarrativeIndex,
		); err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}
