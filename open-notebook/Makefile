.PHONY: dev build clean logs status api database

DOCKER_COMPOSE := docker compose

# === Main Commands ===

# Start all services in detached mode
dev:
	$(DOCKER_COMPOSE) up -d

# Build images
build:
	$(DOCKER_COMPOSE) build

# Stop services and remove containers
clean:
	$(DOCKER_COMPOSE) down

# View logs (follow)
logs:
	$(DOCKER_COMPOSE) logs -f

# Check status
status:
	$(DOCKER_COMPOSE) ps

# === Component Specific ===

# Start only the database
database:
	$(DOCKER_COMPOSE) up -d surrealdb

# Run the API locally (without docker, requires .env)
api:
	uv run backend/run_api.py

# === Utilities ===

# Export docs script
export-docs:
	uv run python scripts/export_docs.py
