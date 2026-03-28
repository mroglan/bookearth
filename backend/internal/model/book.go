package model

import "context"

type MapComposition map[string]any

type Book struct {
	ID             string
	MapComposition MapComposition
}

type BookRepository interface {
	GetMapCompositionById(context.Context, string) (MapComposition, bool, error)
}
