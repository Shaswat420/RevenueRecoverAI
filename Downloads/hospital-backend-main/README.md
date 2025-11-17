# hospital-backend (Docker Compose)

This repository contains a Spring Boot backend for a Hospital microservice. I added a Docker Compose setup to run the application together with a MySQL database.

Files added:

- `docker-compose.yml` — defines `db` (MySQL 8) and `app` (this Spring Boot service).
- `.dockerignore` — excludes build artifacts from Docker context.
 - `.env.example` — example environment variables. Copy to `.env` and edit secrets before running.

Quick start (macOS / Linux):

1. Build and start services:

```bash
docker compose up --build
```

2. The app will be reachable at http://localhost:8081

3. To stop and remove containers:

```bash
docker compose down -v
```

Notes on environment variables:

 - Use `.env` to provide values to the Compose services. Create it from `.env.example`:

```bash
cp .env.example .env
# then edit .env to set any custom values
```

The Compose file will load `.env` automatically and the `app` service uses those vars.

Push changes to GitHub (example):

```bash
git add docker-compose.yml .dockerignore README.md
git commit -m "Add docker-compose and run instructions"
# Create a repo on GitHub first, then:
git remote add origin git@github.com:<your-username>/hospital-backend-main.git
git push -u origin main
```

Form submission text (copy-paste):

Repository URL: https://github.com/<your-username>/hospital-backend-main

Run instructions: `docker compose up --build` then open `http://localhost:8081`
