package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type DBConfig struct {
	ConnectionString string
	Host             string
	Port             int
	User             string
	Password         string
	Database         string
}

type CORSConfig struct {
	Origins []string
}

type Config struct {
	Env     string
	Port    int
	DataDir string
	CORS    CORSConfig
	DB      DBConfig
}

func Load() Config {
	env := strings.TrimSpace(os.Getenv("BACKEND_ENV"))
	if env == "" {
		env = "development"
	}

	defaults := defaultsForEnv(env)
	fmt.Printf("Using %s config\n", strings.ToUpper(env))

	return Config{
		Env:     env,
		Port:    getInt("PORT", defaults.Port),
		DataDir: getString("DATA_DIR", defaults.DataDir),
		CORS: CORSConfig{
			Origins: parseCSV(getString("CORS_ORIGINS", defaults.CORS.OriginsCSV)),
		},
		DB: DBConfig{
			ConnectionString: getString("DATABASE_URL", defaults.DB.ConnectionString),
			Host:             getString("DB_HOST", getString("PGHOST", defaults.DB.Host)),
			Port:             getInt("DB_PORT", getInt("PGPORT", defaults.DB.Port)),
			User:             getString("DB_USER", getString("PGUSER", defaults.DB.User)),
			Password:         getString("DB_PASSWORD", getString("PGPASSWORD", defaults.DB.Password)),
			Database:         getString("DB_NAME", getString("PGDATABASE", defaults.DB.Database)),
		},
	}
}

type envDefaults struct {
	Port    int
	DataDir string
	CORS    corsDefaults
	DB      dbDefaults
}

type corsDefaults struct {
	OriginsCSV string
}

type dbDefaults struct {
	ConnectionString string
	Host             string
	Port             int
	User             string
	Password         string
	Database         string
}

func defaultsForEnv(env string) envDefaults {
	switch env {
	case "production":
		return envDefaults{
			Port:    4000,
			DataDir: "/data",
			CORS: corsDefaults{
				OriginsCSV: "",
			},
			DB: dbDefaults{
				ConnectionString: "",
				Host:             "db",
				Port:             5432,
				User:             "bookearth",
				Password:         "bookearth",
				Database:         "bookearth",
			},
		}
	case "test":
		return envDefaults{
			Port:    4000,
			DataDir: dataDirFromCwd(),
			CORS: corsDefaults{
				OriginsCSV: "",
			},
			DB: dbDefaults{
				ConnectionString: "",
				Host:             "localhost",
				Port:             5432,
				User:             "bookearth",
				Password:         "bookearth",
				Database:         "bookearth",
			},
		}
	default:
		return envDefaults{
			Port:    4000,
			DataDir: dataDirFromCwd(),
			CORS: corsDefaults{
				OriginsCSV: "http://localhost:3000,http://127.0.0.1:3000,http://localhost,http://127.0.0.1",
			},
			DB: dbDefaults{
				ConnectionString: "",
				Host:             "localhost",
				Port:             5432,
				User:             "bookearth",
				Password:         "bookearth",
				Database:         "bookearth",
			},
		}
	}
}

func getString(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func getInt(key string, fallback int) int {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func parseCSV(value string) []string {
	if strings.TrimSpace(value) == "" {
		return []string{}
	}
	parts := strings.Split(value, ",")
	origins := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			origins = append(origins, trimmed)
		}
	}
	return origins
}

func dataDirFromCwd() string {
	wd, err := os.Getwd()
	if err != nil || strings.TrimSpace(wd) == "" {
		return "data"
	}
	return fmt.Sprintf("%s/data", strings.TrimRight(wd, "/"))
}
