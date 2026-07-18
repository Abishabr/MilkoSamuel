# Requirements Document

## Introduction

This feature restructures Samuel Milko's portfolio website from a single-folder Vite SPA that calls Supabase directly into a properly separated **client/server architecture**. The project is reorganised into a `client/` folder (React + Vite frontend) and a `server/` folder (Express.js REST API backend). The Express server uses the Supabase service-role key to communicate with the database securely on the backend. The React frontend communicates only with the Express API — never directly with Supabase for data. Cloudinary handles all media uploads (images, PDFs) via the admin dashboard upload widget; only the resulting `secure_url` is stored in the database. YouTube embed URLs are stored as plain text and rendered as `<iframe>` embeds in the frontend. This feature also resolves the current white/blank page display bug caused by missing environment variables throwing an unhandled error before the React tree can mount.

---

## Glossary

- **Client**: The `client/` subdirectory containing the React + Vite frontend application.
- **Server**: The `server/` subdirectory containing the Express.js backend API.
- **API_Client**: A thin fetch wrapper in `client/src/lib/api.ts` that calls the Express REST API endpoints.
- **Express_Server**: The Node.js + Express.js application in `server/src/index.ts` that handles all data access via Supabase service-role key.
- **Supabase_ServiceRole**: The `SUPABASE_SERVICE_ROLE_KEY` environment variable used exclusively by the Express server for full database access bypassing RLS.
- **Supabase_Anon**: The `VITE_SUPABASE_ANON_KEY` used by the React frontend exclusively for Supabase Auth (login/logout session management).
- **Cloudinary**: Third-party CDN used for images and PDF files. Only the `secure_url` is persisted in the database.
- **YouTube_Embed**: A YouTube video URL or embed URL stored as plain text in the `video_url` column and rendered as an `<iframe>` in the frontend.
- **White_Page_Bug**: The current bug where `src/lib/supabase.ts` throws an unhandled `Error` on import when env vars are missing, crashing the React app before it can render.
- **Admin**: The single authenticated portfolio owner who manages content through the admin dashboard.
- **Visitor**: Any unauthenticated user browsing the public portfolio.
- **RLS**: Supabase Row Level Security — still enabled on all tables for defence-in-depth, even though the Express backend uses the service-role key.

---

## Requirements

### Requirement 1: Fix White/Blank Page Display Bug

**User Story:** As a visitor, I want the portfolio website to always render its UI, so that I never see a blank white page regardless of environment variable configuration.

#### Acceptance Criteria

1. WHEN any required environment variable (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) is missing or empty, THE React application SHALL NOT throw an unhandled error during module initialisation. Instead it SHALL render a visible error state (e.g., a message "Configuration error — please set up environment variables") without a white page.
2. THE `src/lib/supabase.ts` (or equivalent client-side module) SHALL wrap any initialisation error in a try/catch and expose it as a React-renderable error state rather than a thrown module-level exception.
3. WHEN the Supabase client cannot be initialised, the React application SHALL still mount and render the error message rather than crashing the entire component tree.
4. THE `.env.example` file SHALL list all required client-side and server-side environment variables with placeholder values so a developer can copy it to `.env` and fill in real values.
5. THE `client/` folder SHALL contain a `.env.example` listing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. THE `server/` folder SHALL contain a `.env.example` listing `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`, and `CLIENT_URL`.

---

### Requirement 2: Project Structure Reorganisation — Client/Server Split

**User Story:** As a developer, I want the project split into `client/` and `server/` top-level folders, so that frontend and backend concerns are cleanly separated with independent `package.json` files, build configs, and scripts.

#### Acceptance Criteria

1. THE repository root SHALL contain exactly two top-level source folders: `client/` for the React + Vite frontend, and `server/` for the Express.js backend. Shared assets (e.g., `supabase/migrations/`, `supabase/seed.sql`) SHALL remain at the root level.
2. THE `client/` folder SHALL contain its own `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, and the full contents of the current `src/` directory.
3. THE `server/` folder SHALL contain its own `package.json`, `tsconfig.json`, and an `src/` directory with `index.ts` as the Express app entry point.
4. THE root `package.json` SHALL include workspace scripts: `"dev:client"`, `"dev:server"`, and `"dev"` (runs both concurrently). It SHALL use `concurrently` or equivalent to run both in one terminal.
5. THE `client/vite.config.ts` SHALL configure a `server.proxy` entry that forwards all `/api/*` requests to `http://localhost:PORT` (where PORT is read from the server's env). This enables the Vite dev server to proxy API calls to the Express server during development.
6. THE `client/package.json` `dev` script SHALL be `"vite"`. THE `server/package.json` `dev` script SHALL be `"tsx watch src/index.ts"` (or `"ts-node-dev src/index.ts"`).

---

### Requirement 3: Express.js Backend API Server

**User Story:** As a developer, I want an Express.js server that exposes REST API endpoints for all portfolio data entities, so that the React frontend can fetch and mutate data through a typed, authenticated API layer.

#### Acceptance Criteria

1. THE Express server SHALL listen on the port defined by `process.env.PORT` (defaulting to `3001` if not set).
2. THE Express server SHALL include CORS middleware configured to allow requests from `process.env.CLIENT_URL` (defaulting to `http://localhost:5173`).
3. THE Express server SHALL use `express.json()` middleware for request body parsing.
4. THE Express server SHALL connect to Supabase using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables — these SHALL be loaded from `server/.env` using `dotenv`. IF either variable is missing, the server process SHALL log the missing variable name and exit with code 1 before starting to listen.
5. THE Express server SHALL expose the following read-only (GET) endpoints accessible without authentication:
   - `GET /api/settings` — returns the single settings row
   - `GET /api/categories` — returns all categories ordered by name
   - `GET /api/projects` — returns all projects ordered by featured_order
   - `GET /api/projects/:id/images` — returns all images for a project ordered by display_order
   - `GET /api/services` — returns all services ordered by display_order
   - `GET /api/skills` — returns all skills ordered by display_order
   - `GET /api/experiences` — returns all experiences ordered by display_order
   - `GET /api/social-links` — returns all social links
   - `GET /api/process-steps` — returns all process steps ordered by display_order
   - `GET /api/philosophy-items` — returns all philosophy items ordered by display_order
6. THE Express server SHALL expose the following public write endpoint (no auth required):
   - `POST /api/messages` — inserts a new message (contact form submission); validates that `name`, `email`, and `message` are non-empty before inserting
7. THE Express server SHALL expose the following admin-only endpoints protected by the `requireAuth` middleware (Requirement 4):
   - `PUT /api/settings` — updates the settings row
   - `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`
   - `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`
   - `POST /api/projects/:id/images`, `PUT /api/project-images/:id`, `DELETE /api/project-images/:id`
   - `POST /api/services`, `PUT /api/services/:id`, `DELETE /api/services/:id`
   - `POST /api/skills`, `PUT /api/skills/:id`, `DELETE /api/skills/:id`
   - `POST /api/experiences`, `PUT /api/experiences/:id`, `DELETE /api/experiences/:id`
   - `GET /api/messages`, `PUT /api/messages/:id`, `DELETE /api/messages/:id`
   - `POST /api/social-links`, `PUT /api/social-links/:id`, `DELETE /api/social-links/:id`
   - `POST /api/process-steps`, `PUT /api/process-steps/:id`, `DELETE /api/process-steps/:id`
   - `POST /api/philosophy-items`, `PUT /api/philosophy-items/:id`, `DELETE /api/philosophy-items/:id`
8. WHEN a Supabase query fails inside any route handler, THE server SHALL respond with HTTP 500 and a JSON body `{ "error": "[supabase error message]" }`.
9. WHEN a requested resource is not found (e.g., `DELETE /api/projects/:id` where id does not exist), THE server SHALL respond with HTTP 404 and `{ "error": "Not found" }`.

---

### Requirement 4: Admin Authentication Middleware

**User Story:** As the admin, I want Express routes that mutate data to be protected by a JWT verification middleware, so that only authenticated users can modify portfolio content.

#### Acceptance Criteria

1. THE `requireAuth` middleware SHALL extract the Bearer token from the `Authorization` header of incoming requests.
2. THE middleware SHALL verify the token by calling `supabase.auth.getUser(token)` using the server-side Supabase client. IF the token is invalid or expired, THE middleware SHALL respond with HTTP 401 and `{ "error": "Unauthorized" }`.
3. IF the token is valid, THE middleware SHALL call `next()` and attach the user object to `req.user` for use by downstream route handlers.
4. THE React admin dashboard SHALL obtain the Supabase Auth session token via `supabase.auth.getSession()` on the client side (using the anon key client) and include it as `Authorization: Bearer <access_token>` in all mutating API requests to the Express server.
5. THE admin login and logout flows SHALL remain in the React frontend using `supabase.auth.signInWithPassword()` and `supabase.auth.signOut()` with the anon key client — the Express server does NOT handle login/logout routes.

---

### Requirement 5: Frontend API Client Replacement

**User Story:** As a developer, I want `client/src/lib/api.ts` to be the single point of contact between the React frontend and the Express backend, replacing all direct Supabase data queries in the frontend.

#### Acceptance Criteria

1. THE file `client/src/lib/api.ts` SHALL export typed functions for every data entity that mirror the current `src/lib/supabase.ts` function signatures (same names, same parameter types, same return types) but call the Express API endpoints instead of Supabase directly.
2. EACH function in `client/src/lib/api.ts` SHALL fetch from the corresponding Express endpoint (e.g., `getProjects()` calls `GET /api/projects`). For admin write operations, it SHALL include the `Authorization: Bearer <token>` header using the token obtained from `supabase.auth.getSession()`.
3. THE `client/src/lib/supabase.ts` module SHALL be reduced to only initialising and exporting the Supabase anon client for use by auth operations (login, logout, getSession). It SHALL NOT contain any data access functions (`getProjects`, `createProject`, etc.).
4. THE `client/src/context/DataContext.tsx` SHALL import data functions from `client/src/lib/api.ts` (not from `client/src/lib/supabase.ts`).
5. THE `client/src/components/AdminDashboard.tsx` SHALL import write functions from `client/src/lib/api.ts` (not from `client/src/lib/supabase.ts`).
6. THE `client/src/components/ContactForm.tsx` SHALL call `createMessage()` from `client/src/lib/api.ts` to POST to `POST /api/messages`.

---

### Requirement 6: Cloudinary Media Integration (Admin Dashboard)

**User Story:** As the admin, I want to upload images and PDF files through the Cloudinary Upload Widget in the admin dashboard, so that media is hosted on Cloudinary's CDN and only the URL is stored in the database.

#### Acceptance Criteria

1. THE `client/index.html` SHALL include the Cloudinary Upload Widget script: `<script src="https://upload-widget.cloudinary.com/global/all.js"></script>`.
2. THE admin dashboard SHALL provide Cloudinary upload buttons for: `cover_image_url` (image), `banner_image_url` (image), `project_images.image_url` (image), `profile_picture_url` in settings (image), and `resume_url` in settings (PDF/raw).
3. WHEN an upload completes successfully, THE `result.info.secure_url` SHALL be written verbatim into the corresponding form field state with no transformation.
4. WHEN an upload fails or is cancelled, THE admin dashboard SHALL show an inline error message adjacent to the upload button and SHALL leave the URL field value unchanged.
5. THE `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` SHALL be client-side environment variables (prefixed `VITE_`) stored in `client/.env`. IF either is missing when the upload widget is opened, THE dashboard SHALL display an inline error "Cloudinary is not configured" without attempting to open the widget.
6. THE `video_url` project field SHALL remain a plain text input and SHALL NOT trigger Cloudinary. It stores YouTube URLs only.

---

### Requirement 7: YouTube Video Embed Display

**User Story:** As a visitor, I want to see YouTube video embeds in project case study pages, so that I can watch project videos directly on the portfolio without leaving the site.

#### Acceptance Criteria

1. WHEN a project has a non-null `video_url`, THE ProjectModal (case study overlay) SHALL render a responsive `<iframe>` embed of the YouTube video.
2. THE frontend SHALL accept both YouTube watch URLs (`https://www.youtube.com/watch?v=ID`) and YouTube short URLs (`https://youtu.be/ID`) and SHALL convert them to the embed format (`https://www.youtube.com/embed/ID`) before setting the `src` attribute of the `<iframe>`.
3. THE `<iframe>` SHALL include `allowFullScreen`, `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"`, and a `title` attribute for accessibility.
4. THE admin dashboard `video_url` input field SHALL remain a plain text field accepting any URL string — no validation or transformation happens at save time; conversion to embed URL happens only at render time in the frontend.
5. IF `video_url` is null or empty, THE ProjectModal SHALL NOT render an `<iframe>` or any video container.

---

### Requirement 8: Contact Form Supabase-free Submission

**User Story:** As a visitor, I want to submit a contact message through the website without any direct Supabase calls from the browser, so that database credentials are never exposed to the client.

#### Acceptance Criteria

1. WHEN a visitor submits the contact form, THE `ContactForm` SHALL call `POST /api/messages` on the Express server (via `client/src/lib/api.ts`) — it SHALL NOT call Supabase directly.
2. THE frontend `validateContactForm` function SHALL validate: `name` non-empty and ≤ 100 chars; `email` contains `@` and a `.` after the `@`; `subject` non-empty and ≤ 200 chars; `message` non-empty and ≤ 5000 chars. IF validation fails, per-field inline errors SHALL be shown and the API SHALL NOT be called.
3. WHEN the POST request succeeds, THE form SHALL show "Message sent successfully" and clear all fields.
4. IF the POST request fails, THE form SHALL show the error message from the API response, re-enable all fields, and preserve all entered values.
5. THE contact form submission SHALL NOT require authentication.

---

### Requirement 9: Environment Configuration

**User Story:** As a developer, I want all secrets in `.env` files scoped to their respective `client/` and `server/` folders, so that server-side secrets (service role key) are never exposed to the browser bundle.

#### Acceptance Criteria

1. THE `client/.env.example` SHALL list: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`.
2. THE `server/.env.example` SHALL list: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`, `CLIENT_URL`.
3. THE compiled Vite production bundle SHALL NOT contain the string `service_role` anywhere in its output files.
4. THE `.gitignore` at the repository root SHALL include `.env`, `.env.local`, `client/.env`, `client/.env.local`, `server/.env`, and `server/.env.local`.
5. THE `SUPABASE_SERVICE_ROLE_KEY` SHALL be used exclusively in `server/src/` files. It SHALL NOT appear in any file inside `client/src/`.

---

### Requirement 10: Build and Development Scripts

**User Story:** As a developer, I want a single `npm run dev` command at the root to start both the Vite client and Express server concurrently, so that local development requires only one terminal command.

#### Acceptance Criteria

1. THE root `package.json` SHALL define: `"dev": "concurrently \"npm run dev:client\" \"npm run dev:server\""`, `"dev:client": "npm --prefix client run dev"`, `"dev:server": "npm --prefix server run dev"`.
2. THE root `package.json` SHALL define: `"build": "npm --prefix client run build"` for production frontend builds.
3. THE `client/vite.config.ts` SHALL configure `server.proxy` so that `GET /api/*` requests from the browser are forwarded to `http://localhost:3001` (or the configured PORT) during development.
4. THE `server/package.json` SHALL have `tsx` (or `ts-node-dev`) in `devDependencies` and `express`, `cors`, `dotenv`, `@supabase/supabase-js` in `dependencies` at pinned exact versions.
5. THE `client/package.json` SHALL retain React, Vite, TypeScript, Tailwind, and `@supabase/supabase-js` (for auth only) as dependencies at pinned exact versions.
