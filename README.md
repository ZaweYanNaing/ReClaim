# ReClaim

Laravel + React (Inertia) application for ReClaim Mandalay.

## Docker Development

This project includes a multi-container Docker setup for local development.

### Services

| Service     | Description                          | URL / Port                    |
|-------------|--------------------------------------|-------------------------------|
| `app`       | Laravel PHP-FPM                      | Internal only                 |
| `webserver` | Nginx (serves `public/`)             | http://localhost              |
| `db`        | MySQL 8 with persistent storage      | `localhost:3306`              |
| `phpmyadmin`| Database management UI               | http://localhost:8081         |
| `node`      | Vite dev server (React hot-reload)   | http://localhost:5173         |

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Docker Compose v2)
- Copy `.env.example` to `.env` if you have not already

### Environment variables

Database credentials are read from `.env` — nothing is hardcoded in `docker-compose.yml`:

```dotenv
DB_HOST=db
DB_DATABASE=reclaim_mandalay
DB_USERNAME=reclaim
DB_PASSWORD=password
DB_ROOT_PASSWORD=password

APP_PORT=80
VITE_PORT=5173
FORWARD_PHPMYADMIN_PORT=8081
VITE_DEV_SERVER_URL=http://localhost:5173
```

`DB_HOST` must be `db` (the Docker service name), not `localhost`.

### First-time setup

```bash
# Build and start all containers in the background
docker compose up -d --build

# Install PHP dependencies (first run only)
docker compose exec app composer install

# Generate an application key (first run only, if APP_KEY is empty)
docker compose exec app php artisan key:generate

# Run database migrations
docker compose exec app php artisan migrate

# Generate TypeScript route helpers for the React frontend
docker compose exec app php artisan wayfinder:generate

# Seed townships, categories, and a test user
docker compose exec app php artisan db:seed
```

The `node` service installs npm dependencies automatically on first start and runs the Vite dev server with hot-reload enabled.

### Daily usage

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f

# Run Artisan commands
docker compose exec app php artisan <command>

# Run tests
docker compose exec app php artisan test --compact
```

### Accessing phpMyAdmin

Open [http://localhost:8081](http://localhost:8081) in your browser.

Log in with:

- **Server:** `db`
- **Username:** `root`
- **Password:** value of `DB_ROOT_PASSWORD` from `.env`

Or use the application user (`DB_USERNAME` / `DB_PASSWORD`) to access only the `reclaim_mandalay` database.

### Frontend hot-reload

Vite runs in the `node` container and is exposed on port `5173`. File changes under `resources/js` and `resources/css` trigger hot module replacement in the browser.

If assets do not load, confirm:

1. The `node` container is running: `docker compose ps`
2. `VITE_DEV_SERVER_URL=http://localhost:5173` is set in `.env`
3. Vite logs show no errors: `docker compose logs -f node`
4. Wayfinder types exist (generate from the PHP container, not `node`):

```bash
docker compose exec app php artisan wayfinder:generate
```

If the UI still shows the default Laravel Starter Kit placeholders, rebuild assets:

```bash
docker compose exec app php artisan wayfinder:generate
docker compose exec -e WAYFINDER_COMMAND=true node npm run build
```

Then hard-refresh the browser (`Cmd+Shift+R`).

**`node` container keeps restarting / `php: not found`**

The `node` image does not include PHP. Wayfinder types must be generated in the `app` container (`php artisan wayfinder:generate`). The `node` service sets `WAYFINDER_COMMAND=true` so Vite skips calling PHP on startup.

### Troubleshooting

**Port already allocated (e.g. `Bind for 0.0.0.0:3306 failed`)**

Old Sail containers may still be running and holding ports. Stop them and restart:

```bash
docker stop reclaim-mysql-1 reclaim-laravel.test-1 2>/dev/null
docker rm reclaim-mysql-1 reclaim-laravel.test-1 2>/dev/null
docker compose up -d --remove-orphans
```

Alternatively, change `FORWARD_DB_PORT` in `.env` to a free port (e.g. `3307`) if you need local MySQL on 3306.

**Orphan container warnings**

If you see warnings about `reclaim-laravel.test-1` or `reclaim-mysql-1`, run `docker compose up -d --remove-orphans` to clean them up.

### Laravel Sail

The repository also contains `compose.sail.yaml` for [Laravel Sail](https://laravel.com/docs/sail). Use `docker compose` for the Nginx + PHP-FPM setup described above, or `./vendor/bin/sail` for the Sail workflow.



# Build and start all containers
docker compose up -d --build

# Install PHP dependencies (first run only)
docker compose exec app composer install

# Generate app key (if APP_KEY is empty in .env)
docker compose exec app php artisan key:generate

# Run migrations
docker compose exec app php artisan migrate




# Daily Use 
docker compose up -d       # start
docker compose down        # stop
docker compose logs -f     # view logs
