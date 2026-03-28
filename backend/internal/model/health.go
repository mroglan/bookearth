package model

import "context"

type HealthRepository interface {
	Check(ctx context.Context) error
}
