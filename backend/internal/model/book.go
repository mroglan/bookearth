package model

import "context"

type MapCompositionOverlay struct {
	Type    string  `json:"type"`
	Variant string  `json:"variant,omitempty"`
	Opacity float64 `json:"opacity,omitempty"`
}

type MapCompositionPostProcessing struct {
	ColorGrade string `json:"colorGrade,omitempty"`
}

type MapComposition struct {
	Base           string                        `json:"base"`
	Overlays       []MapCompositionOverlay       `json:"overlays"`
	PostProcessing *MapCompositionPostProcessing `json:"postProcessing,omitempty"`
}

type Book struct {
	ID             string
	MapComposition MapComposition
}

type BookRepository interface {
	GetMapCompositionById(context.Context, string) (MapComposition, bool, error)
}
