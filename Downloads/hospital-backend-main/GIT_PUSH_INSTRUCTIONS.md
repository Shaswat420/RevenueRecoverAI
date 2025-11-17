# Git push instructions

Run these commands from the repository root. Replace `<your-username>` and the branch name if different.

```bash
# Stage changed files
git add docker-compose.yml .env.example .dockerignore README.md src/main/resources/application.properties

# Commit
git commit -m "Add docker-compose, .env.example, and env-driven application properties"

# Add remote (only if not already set). Use SSH or HTTPS depending on your setup.
git remote add origin git@github.com:<your-username>/hospital-backend-main.git

# Push to GitHub
git push -u origin main
```

If you already have a remote named `origin`, skip the `git remote add` step. If your default branch is `master` replace `main` with `master`.
