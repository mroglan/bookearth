package model

import "context"

type MapComposition map[string]any

type Book struct {
	ID             string
	MapComposition MapComposition
}

type BookRepository interface {
	FetchMapCompositionByBook(ctx context.Context, bookID string) (MapComposition, bool, error)
}
