package repository

import "context"

type PostgresHealthRepository struct {
	conn Connection
}

func NewPostgresHealthRepository(conn Connection) *PostgresHealthRepository {
	return &PostgresHealthRepository{conn: conn}
}

func (r *PostgresHealthRepository) Check(ctx context.Context) error {
	var probe int
	return r.conn.QueryRow(ctx, "SELECT 1").Scan(&probe)
}
