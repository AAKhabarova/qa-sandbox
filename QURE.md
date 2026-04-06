# E2E Testing Documentation

## Overview
- Repository purpose: QA Sandbox, a full-stack social network intended as a local practice environment for QA automation.
- Stack at a glance:
  - Frontend: React 18 + TypeScript + Vite
  - Backend: FastAPI
  - Database: PostgreSQL
  - Infra: Docker Compose
  - E2E tooling in repo root: Playwright
- Main runtime endpoints from repository configuration:
  - Frontend: `http://localhost:3000`
  - Backend API: `http://localhost:8000`
  - pgweb: `http://localhost:8081`
  - PostgreSQL exposed by Docker Compose: `localhost:5433`
- Important repo note: documentation inside `README.md` and `backend/app/main.py` mentions PostgreSQL on `5432`, but `docker-compose.yml` actually exposes it on `5433`.

## Tech Stack
### Root / Test Tooling
- `@playwright/test` is installed in the root `package.json`.
- Root `package.json` has no npm scripts defined, so Playwright is expected to be run directly.
- Module type at repo root is `commonjs`.

### Frontend
- Package: `frontend/package.json`
- Frameworks/libraries observed:
  - `react`
  - `react-dom`
  - `react-router-dom`
  - `axios`
  - `react-hot-toast`
  - `react-hook-form`
  - Tailwind CSS
  - Vite
- Routing is defined in `frontend/src/App.tsx`.
- The app is wrapped with `I18nProvider` and `AuthProvider`.

### Backend
- FastAPI app entry point: `backend/app/main.py`
- API router aggregator: `backend/app/api/router.py`
- Registered API areas:
  - auth
  - users
  - follows
  - posts
  - comments
  - likes
  - bookmarks
  - messages
  - notifications
  - search
  - admin
  - upload
  - system
- Backend creates tables on startup and seeds initial data when no users exist.

## Repository Structure
```text
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── tests/
│   ├── Pages/
│   │   └── login.page.ts
│   └── login.spec.ts
├── docker-compose.yml
├── global-teardown.ts
├── package.json
├── playwright.config.ts
└── README.md
```

## Frontend Routes and UI Areas
Routes observed in `frontend/src/App.tsx`:
- Public auth routes:
  - `/login`
  - `/register`
- App routes inside shared layout:
  - `/`
  - `/explore`
  - `/search`
  - `/post/:id`
  - `/profile/:username`
  - `/profile/:username/followers`
  - `/profile/:username/following`
  - `/messages`
  - `/messages/:id`
  - `/notifications`
  - `/bookmarks`
  - `/settings`
  - `/admin`
  - `/admin/users`
  - `/admin/content`
  - `/docs`

Page group directories present under `frontend/src/pages/`:
- `admin`
- `auth`
- `bookmarks`
- `docs`
- `feed`
- `messages`
- `notifications`
- `post`
- `profile`
- `search`
- `settings`

## Selectors and Testability
- The frontend uses many `data-testid` attributes across pages and reusable components.
- Selector style is consistent and domain-oriented, for example:
  - Auth: `auth-email-input`, `auth-password-input`, `auth-login-btn`, `auth-error-message`
  - Navigation: `nav-logo`, `nav-profile`, `nav-settings`, `nav-admin`, `nav-docs`, `auth-logout-btn`
  - Posts: `post-card-{id}`, `post-like-btn-{id}`, `post-comments-count-{id}`, `post-bookmark-btn-{id}`
  - Composer: `post-composer-input`, `post-composer-submit`
  - Comments: `comment-input`, `comment-submit-btn`, `comment-reply-btn-{id}`
  - Profile: `profile-follow-btn`, `profile-message-btn`, `profile-followers-count`
  - Messages: `new-conversation-btn`, `message-input`, `message-send-btn`
  - Notifications: `notifications-mark-all-btn`, `notification-{id}`
  - Admin: `admin-search-input`, `admin-role-select-{uid}`, `admin-ban-btn-{uid}`
  - Settings: `reset-database-btn`
- This repo is friendly to Playwright/Cypress/Selenium because selectors are explicit and stable.

## Existing Automated Test Setup
### Playwright Configuration
Observed in `playwright.config.ts`:
- `testDir`: `./tests`
- `fullyParallel`: `true`
- `reporter`: `html`
- `baseURL`: `http://localhost:3000`
- `trace`: `on-first-retry`
- Browser project enabled: `chromium`
- CI behavior:
  - `retries`: `2`
  - `workers`: `1`
- `globalTeardown` is configured as `./global-teardown.ts`

### Environment Startup for E2E
- Playwright `webServer` runs `docker compose up --build`.
- It waits for `http://localhost:3000`.
- `reuseExistingServer` is enabled outside CI.
- Startup timeout is `120000` ms.

### Current Test Files
- `tests/login.spec.ts` exists but is currently empty.
- `tests/Pages/login.page.ts` contains an initial Playwright page object scaffold:
  - class `LoginPage`
  - methods `goto()` and `login(email, password)`
  - implementation is incomplete (`page.locator('')`, login only fills email)

## Recommended Testing Conventions Based on Current Repo
These are grounded in the current codebase rather than hypothetical standards:
- Use Playwright for E2E tests in the root `tests/` directory.
- Prefer `data-testid` selectors over visual text or CSS structure selectors.
- Use `page.goto()` with relative routes because `baseURL` is configured.
- Keep browser-driven tests compatible with the Docker Compose environment started by Playwright.
- If expanding the current structure, page objects should live under `tests/Pages/` to match the existing scaffold.

## Useful Commands
### Start the application stack manually
```bash
docker compose up --build
```

### Run Playwright tests
```bash
npx playwright test
```

### Open Playwright HTML report
```bash
npx playwright show-report
```

## Test Data and QA-Specific App Characteristics
From repository documentation and startup behavior:
- The application is intentionally designed for QA practice.
- Seed data is created automatically by the backend on first startup.
- The app includes a built-in `/docs` page in the frontend.
- The backend also exposes Swagger docs at `/docs` and ReDoc at `/redoc`.
- README documents pre-seeded user accounts and many test scenarios.
- There is a reset capability exposed via API at `POST /api/reset`.

## Important Observations for Future Test Work
- Root-level test automation is only partially implemented; current Playwright files are scaffolds, not a mature suite.
- Repository documentation is richer than the current automated coverage.
- Because Docker Compose is wired into Playwright `webServer`, tests should assume containerized startup unless the environment is already running.
- The frontend appears highly testable because `data-testid` coverage is broad across auth, feed, messaging, notifications, admin, and settings features.
- When writing new tests, verify live selectors against the frontend because the README is extensive, but the source code is the most reliable reference.
