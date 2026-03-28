package model

import "context"

type Event struct {
	ID             string  `json:"id"`
	BookID         string  `json:"book_id"`
	ParentEventID  *string `json:"parent_event_id"`
	Title          string  `json:"title"`
	Description    *string `json:"description"`
	Lat            float64 `json:"lat"`
	Lon            float64 `json:"lon"`
	Importance     *int    `json:"importance"`
	NarrativeIndex *int    `json:"narrative_index"`
}

type EventRepository interface {
	GetByBookId(ctx context.Context, bookID string) ([]Event, error)
}
