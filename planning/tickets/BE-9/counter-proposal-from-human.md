# Counter Proposal from Human

Let's do something simpler for now. What are your thoughts on structuring the backend like this for now:
backend
- cmd 
    - server
        - main.go (package) (creates db connection using CreatePostgresConnection, creates api struct by passing in db connection, and starts server by calling api.Server)
- internal
    - api (package)
        - main.go (NewAPI function that returns api struct, api.Server function which links routes together)
        - handlers.go (call the repoistory implementations to perform actions)
        - routes.go (set up with chiMux, each route endpoint points to a handler)
        - middleware.go (just cors for now)
    - model (package)
        - book.go (struct for the book data structure, as well as a BookRepository type that will be implemented by repository)
        - event.go (struct for the event data structure, as well as an EventRepository type that will be implemented by repository)
    - repository (package)
        - connection.go this interface for a connection: 
        ```
            type Connection interface {
                Exec(context.Context, string, ...interface{}) (pgconn.CommandTag, error)
                Query(context.Context, string, ...interface{}) (pgx.Rows, error)
                QueryRow(context.Context, string, ...interface{}) pgx.Row
            }
        ```
        - postgres_book.go (implements BookRepository; conn included in struct with type Connection)
        - postgres_event.go (implements EventRepository; conn included in struct with type Connection)
    - db (package)
        - postgres.go (has CreatePostgresConnection that returns pgxpool.Pool, which happens to implement the Connection type I defined in connection.go)
    - config (package)
        - config.go (leave this as is, continue using it throughout the code like today)


# Misc thing

the module should be https://github.com/mroglan/bookearth/backend