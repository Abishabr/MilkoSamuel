# Requirements Document

## Introduction

This feature migrates Samuel Milko's portfolio website from a monorepo Express + local JSON file architecture to a fully decoupled frontend + Supabase backend architecture. The Express server (`server.ts`, `server/db.ts`) and local JSON file (`data/portfolio-db.json`) are replaced by a Supabase PostgreSQL database, Supabase Auth, and Supabase Row Level Security. The React + Vite frontend communicates directly with Supabase via the `@supabase/supabase-js` client. Media assets (images, resume PDF) are hosted on Cloudinary; video content is stored as YouTube embed URLs. All existing admin dashboard functionality is preserved and updated to use the new data layer.

---

## Glossary

- **Supabase_Client**: The `@supabase/supabase-js` browser client initialized with the project URL and anon key.
- **Admin**: The single authenticated user who can create, update, and delete portfolio data. Identified by Supabase Auth session.
- **Visitor**: Any unauthenticated user browsing the public portfolio website.
- **RLS**: Supabase Row Level Security — PostgreSQL policies that enforce per-row access control at the database level.
- **Cloudinary**: Third-party media hosting service used to store and serve images and PDF files. Only the resulting URL is stored in Supabase.
- **Supabase_Auth**: The Supabase authentication service used for admin email + password sign-in and session management.
- **DataContext**: The React context (`src/context/DataContext.tsx`) that fetches and exposes portfolio data to all frontend components.
- **Supabase_Layer**: The new `src/lib/supabase.ts` module containing the initialized Supabase_Client and all data access functions, replacing `src/lib/api.ts`.
- **Settings**: A single-row PostgreSQL table containing global site configuration (title, logo, hero text, biography, profile picture URL, resume URL, footer text, theme color, and stats).
- **Project**: A portfolio project record with title, slug, client, date, description, technologies array, cover image URL, banner image URL, YouTube video URL, rich content fields, featured flags, and a foreign key to Category.
- **Project_Image**: A gallery image record belonging to a Project, containing a Cloudinary URL, caption, and display order.
- **Category**: A classification label for projects containing id, name, and slug.
- **Service**: A service offered by Samuel Milko, with name, description, Lucide icon name, and display order.
- **Skill**: A named skill with a proficiency percentage, icon name, and display order.
- **Experience**: A work experience entry with company, position, description, start date, end date, and display order.
- **Message**: A contact form submission containing sender name, email, subject, body, timestamp, and read status.
- **Social_Link**: A social platform name and URL pair.
- **Process_Step**: A numbered step in Samuel Milko's creative process with title, description, and display order.
- **Philosophy_Item**: A design philosophy statement with title, description, and display order.
- **Conventional_Commit**: A commit message format following the pattern `type(scope): description` (e.g., `feat: add supabase schema for projects table`).

---

## Requirements

### Requirement 1: Supabase Database Schema

**User Story:** As a developer, I want all portfolio data entities to be defined as PostgreSQL tables in Supabase, so that the application has a structured, queryable, and type-safe persistent data store.

#### Acceptance Criteria

1. THE Supabase_Client SHALL connect to a Supabase project using environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. IF either variable is absent or empty at application startup, THE Supabase_Layer SHALL throw an initialization error naming the missing variable before making any network request.
2. THE database SHALL contain the following tables, each with a primary key column `id` of type `uuid` with a database-generated default (`gen_random_uuid()`): `settings`, `categories`, `projects`, `project_images`, `services`, `skills`, `experiences`, `messages`, `social_links`, `process_steps`, `philosophy_items`.
3. THE `settings` table SHALL contain exactly one row enforced by a database-level CHECK constraint (`id = '00000000-0000-0000-0000-000000000001'::uuid` or equivalent singleton pattern) and SHALL include columns: `id`, `website_title`, `logo`, `theme_color`, `footer_text`, `biography`, `hero_text`, `profile_picture_url`, `resume_url`, `years_experience`, `projects_completed`, `happy_clients`.
4. THE `projects` table SHALL include columns: `id`, `title`, `slug` (UNIQUE, NOT NULL), `client`, `project_date`, `description`, `technologies` (text array), `cover_image_url`, `banner_image_url`, `video_url`, `creative_process`, `challenges`, `final_result`, `is_featured` (boolean, defaulting to `false`), `featured_order`, `category_id` (foreign key to `categories.id`), `testimonial_quote`, `testimonial_author`, `testimonial_role`.
5. THE `project_images` table SHALL include columns: `id`, `project_id` (foreign key to `projects.id` with `ON DELETE CASCADE`), `image_url`, `caption`, `display_order`.
6. THE `services`, `skills`, `process_steps`, and `philosophy_items` tables SHALL each include a `display_order` integer column.
7. THE `categories` table SHALL include columns: `id`, `name` (NOT NULL), `slug` (UNIQUE, NOT NULL). THE `social_links` table SHALL include: `id`, `platform` (NOT NULL), `url` (NOT NULL). THE `experiences` table SHALL include: `id`, `company`, `position`, `description`, `start_date`, `end_date`, `display_order`. THE `skills` table SHALL include: `id`, `name`, `percentage` (integer, 0–100), `icon`, `display_order`.
8. THE `messages` table SHALL include columns: `id`, `name` (NOT NULL), `email` (NOT NULL), `subject`, `message` (NOT NULL), `created_at` (timestamptz, defaulting to `now()`), `is_read` (boolean, defaulting to `false`).
9. THE database schema SHALL be expressed as a versioned SQL migration file stored in the repository at `supabase/migrations/` following the naming convention `YYYYMMDDHHMMSS_description.sql` (e.g., `20240101000000_initial_schema.sql`).

---

### Requirement 2: Row Level Security Policies

**User Story:** As the site owner, I want Supabase RLS to enforce that public visitors can only read data and only the authenticated admin can write data, so that portfolio content cannot be vandalized by unauthorized users.

#### Acceptance Criteria

1. THE database SHALL have RLS enabled on all tables listed in Requirement 1, Criterion 2.
2. WHEN a Visitor sends a SELECT query to any public table (`settings`, `categories`, `projects`, `project_images`, `services`, `skills`, `experiences`, `social_links`, `process_steps`, `philosophy_items`), THE database SHALL return all rows from that table.
3. IF a Visitor attempts an INSERT, UPDATE, or DELETE on any table other than `messages`, THEN THE database SHALL reject the operation with a Postgres permission error (RLS policy violation).
4. IF an Admin is authenticated via Supabase_Auth, THEN THE database SHALL permit SELECT, INSERT, UPDATE, and DELETE on all tables.
5. WHEN a Visitor submits a contact form, THE database SHALL permit INSERT on the `messages` table from an unauthenticated (anon role) request.
6. IF a Visitor attempts a SELECT, UPDATE, or DELETE on the `messages` table, THEN THE database SHALL reject the operation with a permission error.
7. THE RLS policies SHALL be expressed in the same SQL migration file as the schema defined in Requirement 1.

---

### Requirement 3: Supabase Auth — Admin Login

**User Story:** As the admin, I want to log in with my email and password using Supabase Auth, so that my session is managed securely without a custom token implementation.

#### Acceptance Criteria

1. WHEN the Admin submits valid credentials on the admin login form, THE Supabase_Client SHALL call `supabase.auth.signInWithPassword({ email, password })` and THE AdminDashboard SHALL transition from displaying the login form to displaying the management interface.
2. WHEN the Admin submits an invalid email or password, THE Supabase_Client SHALL surface the Supabase Auth error message and THE AdminDashboard SHALL display that error inline on the login form without navigating away.
3. WHEN the Admin successfully signs in, THE AdminDashboard SHALL rely exclusively on Supabase Auth's built-in session persistence (stored in `localStorage` by the Supabase_Client) and SHALL NOT write any additional custom token or session key to `localStorage` or `sessionStorage`.
4. WHEN the Admin clicks the logout button, THE Supabase_Client SHALL call `supabase.auth.signOut()` and THE AdminDashboard SHALL replace the management interface with the login form within the same render cycle.
5. WHEN the application loads and `supabase.auth.getSession()` returns a non-null session, THE AdminDashboard SHALL display the management interface directly without rendering the login form.
6. THE `hashPassword` function in `server/db.ts` and the `/api/auth/login` Express route in `server.ts` SHALL both be deleted from the repository.

---

### Requirement 4: Frontend Data Layer Replacement

**User Story:** As a developer, I want `src/lib/api.ts` replaced by a Supabase-based data layer at `src/lib/supabase.ts`, so that the frontend communicates directly with Supabase and no longer depends on the Express server.

#### Acceptance Criteria

1. THE file `src/lib/supabase.ts` SHALL export: (a) a named `supabase` Supabase_Client instance, and (b) typed data access functions for every entity defined in Requirement 1.
2. WHEN the DataContext initializes, THE Supabase_Layer SHALL issue Supabase queries for `settings`, `categories`, `projects`, `project_images`, `services`, `skills`, `experiences`, `social_links`, `process_steps`, and `philosophy_items` concurrently using `Promise.allSettled`.
3. WHEN an individual Supabase query fails, THE DataContext SHALL set its `error` state to a string in the format `"Failed to load [entity]: [supabase error message]"` and SHALL leave other successfully loaded entities' state values unchanged.
4. THE Supabase_Layer SHALL expose typed `create`, `update`, and `delete` functions for the following writable entities: `categories`, `projects`, `project_images`, `services`, `skills`, `experiences`, `social_links`, `process_steps`, `philosophy_items`, and `messages`. THE `settings` entity SHALL be exposed via an `updateSettings` function. All write functions SHALL rely on the Supabase_Client's current authenticated session (set via `supabase.auth.signInWithPassword`) for RLS authorization — no session parameter needs to be passed explicitly.
5. THE `src/lib/api.ts` file SHALL be deleted and all `import` statements that reference `../lib/api` or `./lib/api` in `src/` SHALL be updated to reference `../lib/supabase` or `./lib/supabase` respectively.
6. THE `server.ts` file and `server/db.ts` file SHALL be deleted from the repository. THE `server/` directory SHALL be removed if empty after deletion.
7. THE `data/portfolio-db.json` file SHALL be deleted from the repository only after the seed SQL defined in Requirement 11 has been executed successfully against the Supabase database. THE `data/` directory SHALL be removed if empty after deletion.

---

### Requirement 5: TypeScript Type Definitions Update

**User Story:** As a developer, I want `src/types.ts` updated to match the Supabase schema column names, so that type checking catches mismatches between frontend code and database fields.

#### Acceptance Criteria

1. THE `src/types.ts` file SHALL export TypeScript interfaces for all entities: `Settings`, `Category`, `Project`, `ProjectImage`, `Service`, `Skill`, `Experience`, `Message`, `SocialLink`, `ProcessStep`, `PhilosophyItem`.
2. THE `Project` interface SHALL use exactly these field names: `id: string`, `title: string`, `slug: string`, `client: string | null`, `project_date: string | null`, `description: string | null`, `technologies: string[]`, `cover_image_url: string | null`, `banner_image_url: string | null`, `video_url: string | null`, `creative_process: string | null`, `challenges: string | null`, `final_result: string | null`, `is_featured: boolean`, `featured_order: number | null`, `category_id: string | null`, `testimonial_quote: string | null`, `testimonial_author: string | null`, `testimonial_role: string | null`.
3. THE `Settings` interface SHALL use exactly these field names: `id: string`, `website_title: string`, `logo: string`, `theme_color: string`, `footer_text: string`, `biography: string`, `hero_text: string`, `profile_picture_url: string | null`, `resume_url: string | null`, `years_experience: string`, `projects_completed: string`, `happy_clients: string`.
4. THE remaining interfaces SHALL use these field definitions — `Category`: `{ id: string; name: string; slug: string }`; `ProjectImage`: `{ id: string; project_id: string; image_url: string; caption: string | null; display_order: number }`; `Service`: `{ id: string; name: string; description: string; icon: string; display_order: number }`; `Skill`: `{ id: string; name: string; percentage: number; icon: string; display_order: number }`; `Experience`: `{ id: string; company: string; position: string; description: string | null; start_date: string; end_date: string | null; display_order: number }`; `Message`: `{ id: string; name: string; email: string; subject: string | null; message: string; created_at: string; is_read: boolean }`; `SocialLink`: `{ id: string; platform: string; url: string }`; `ProcessStep`: `{ id: string; number: string; title: string; description: string; display_order: number }`; `PhilosophyItem`: `{ id: string; title: string; description: string; display_order: number }`.
5. THE old interfaces (`Project` with camelCase fields, `Service` with `iconName`, `ProcessStep` with `step` field, `Stat`, `SoftwareItem`) SHALL be removed from `src/types.ts`. THE corresponding imports in `src/data.ts` SHALL also be removed or updated.
6. WHERE Supabase CLI-generated types are available at `src/types/supabase.ts`, THE Supabase_Layer functions SHALL be annotated to use the generated `Database` row types for additional compile-time safety.

---

### Requirement 6: Admin Dashboard Migration

**User Story:** As the admin, I want all current dashboard management capabilities preserved after the migration, so that I can continue managing all portfolio content using the new Supabase backend.

#### Acceptance Criteria

1. THE AdminDashboard SHALL use Supabase_Auth for login and logout as specified in Requirement 3.
2. THE AdminDashboard SHALL support full CRUD operations — create, list all records, update, and delete — for: `projects`, `categories`, `services`, `skills`, `experiences`, `social_links`, `process_steps`, `philosophy_items`.
3. THE AdminDashboard SHALL support listing all `messages` records and toggling a message's `is_read` field between `true` and `false`, and SHALL support deleting individual messages.
4. THE AdminDashboard SHALL support updating the single `settings` row by reading the current values and saving the full updated object via the Supabase_Layer `updateSettings` function.
5. WHEN the Admin creates or updates a `project`, THE AdminDashboard SHALL provide separate Cloudinary upload triggers for `cover_image_url` and `banner_image_url`, and each trigger SHALL store the returned `secure_url` into its respective field. WHEN the Admin adds a gallery image to `project_images`, THE AdminDashboard SHALL invoke the Cloudinary widget and store the `secure_url` in the `image_url` field.
6. WHEN the Admin saves a project, THE AdminDashboard SHALL accept a plain-text YouTube URL or embed URL in the `video_url` input field and save it directly to the database without invoking Cloudinary.
7. WHEN the Admin updates Settings, THE AdminDashboard SHALL provide separate Cloudinary upload triggers for the `profile_picture_url` and `resume_url` fields, each storing the returned `secure_url` in its respective field.
8. IF a Supabase write operation returns an error, THEN THE AdminDashboard SHALL display an inline error message identifying the entity type and operation that failed (e.g., "Failed to update project: [error message]"), and all unsaved form field values SHALL remain intact in the form.
9. THE AdminDashboard SHALL support full CRUD operations — create, list, update, and delete — for `project_images` records associated with a given project.

---

### Requirement 7: Cloudinary Image Integration

**User Story:** As the admin, I want to upload images and the resume PDF through Cloudinary, so that media files are hosted on a dedicated CDN and only their URLs are stored in the database.

#### Acceptance Criteria

1. THE AdminDashboard SHALL integrate the Cloudinary Upload Widget by loading the Cloudinary script (`https://upload-widget.cloudinary.com/global/all.js`) and calling `window.cloudinary.createUploadWidget()` with an unsigned upload preset.
2. WHEN the Admin clicks an image upload button, THE Cloudinary Upload Widget SHALL open. For project image fields (`cover_image_url`, `banner_image_url`, `project_images.image_url`), THE widget SHALL accept JPG, PNG, GIF, WebP, and SVG file types. For the `resume_url` field, THE widget SHALL accept PDF file types only.
3. WHEN the Cloudinary upload completes successfully, THE AdminDashboard SHALL overwrite the corresponding URL field's current value with the `secure_url` from the Cloudinary response object.
4. THE application SHALL NOT store binary image or PDF data in Supabase Storage or any other server-side store; only the Cloudinary `secure_url` string SHALL be persisted.
5. THE Cloudinary cloud name and unsigned upload preset name SHALL be read from environment variables `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`. IF either variable is missing at startup, THE Supabase_Layer initialization SHALL throw a descriptive error naming the missing variable.
6. IF the Cloudinary upload fails or is cancelled by the Admin, THEN THE AdminDashboard SHALL display an inline error message indicating the reason for failure, the upload widget SHALL close, and the corresponding URL field SHALL retain its previous value unchanged.

---

### Requirement 8: Contact Form Public Submission

**User Story:** As a visitor, I want to submit a contact message through the website, so that Samuel Milko can receive inquiries without me needing an account.

#### Acceptance Criteria

1. WHEN a Visitor submits the contact form, THE ContactForm SHALL validate that: `name` is non-empty and at most 100 characters; `email` matches a valid email format (contains `@` and a domain); `subject` is non-empty and at most 200 characters; `message` is non-empty and at most 5000 characters. IF any field fails validation, THE form SHALL display a per-field inline error message and SHALL NOT submit the data to Supabase.
2. WHEN all fields pass validation, THE Supabase_Client SHALL call `supabase.from('messages').insert(...)` and THE ContactForm SHALL disable the submit button and all input fields for the duration of the in-flight request to prevent duplicate submissions.
3. WHEN the contact form INSERT succeeds, THE ContactForm SHALL display a visible success message (e.g., "Message sent successfully") and SHALL clear all form fields.
4. IF the contact form INSERT fails due to a Supabase or network error, THEN THE ContactForm SHALL display an inline error message containing the Supabase error message, re-enable the submit button and all input fields, and preserve all field values entered by the Visitor.
5. THE contact form submission SHALL NOT require authentication; the Supabase_Client SHALL operate with the anon key.
6. THE `messages` table RLS policy SHALL permit INSERT from unauthenticated (anon role) requests and SHALL deny SELECT, UPDATE, and DELETE from unauthenticated requests per Requirement 2, Criteria 5 and 6.

---

### Requirement 9: Environment Configuration

**User Story:** As a developer, I want all secrets and configuration values stored in environment variables, so that no credentials are committed to the repository.

#### Acceptance Criteria

1. THE repository SHALL contain a `.env.example` file listing all required environment variables with placeholder values in the format `VARIABLE_NAME=your-variable-name-here`: `VITE_SUPABASE_URL=your-supabase-url-here`, `VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here`, `VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name-here`, `VITE_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset-here`.
2. THE `.gitignore` file SHALL include `.env` and `.env.local` as separate entries to prevent accidental credential commits.
3. THE compiled Vite production bundle SHALL NOT contain the string `service_role` anywhere in its output files. This SHALL be verified by running `grep -r "service_role" dist/` and confirming zero matches.
4. IF any of the four required environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`) is missing or empty when `src/lib/supabase.ts` is first imported, THEN THE module SHALL throw an `Error` before creating the Supabase_Client, with a message in the format: `"Missing required environment variable: VITE_SUPABASE_URL"` (naming the specific missing variable).

---

### Requirement 10: Express Server Removal and Build System Update

**User Story:** As a developer, I want the Express server removed and the build scripts updated, so that the project builds and runs as a pure Vite frontend without any Node.js backend.

#### Acceptance Criteria

1. THE `package.json` `dev` script SHALL be `"vite"` (invoking the Vite dev server directly, not `tsx server.ts`).
2. THE `package.json` `build` script SHALL be `"vite build"` only, with no `esbuild` bundling of `server.ts`.
3. THE `package.json` `start` script SHALL be removed entirely, since there is no Node.js server to start for the deployed frontend.
4. THE `express` and `@types/express` packages SHALL be removed from `package.json` `dependencies` and `devDependencies` respectively. THE `tsx` package SHALL be removed from `package.json` `devDependencies`. THE `esbuild` package SHALL be removed from `package.json` `devDependencies` if it is no longer used by any remaining script.
5. THE `@supabase/supabase-js` package SHALL be added to `package.json` `dependencies` at an exact pinned version (e.g., `"@supabase/supabase-js": "2.x.x"`).
6. THE `vite.config.ts` file SHALL be inspected and any `server.proxy` configuration block that forwarded `/api` requests to a local Express port SHALL be removed. IF no proxy configuration exists, this criterion is satisfied by default.

---

### Requirement 11: Data Migration

**User Story:** As the site owner, I want all existing portfolio data from `portfolio-db.json` migrated to Supabase, so that no content is lost during the transition.

#### Acceptance Criteria

1. THE repository SHALL contain a seed SQL file at `supabase/seed.sql` that inserts all records currently present in `data/portfolio-db.json` into the corresponding Supabase tables.
2. THE seed data SHALL use the snake_case Supabase column naming conventions defined in Requirement 5 (e.g., JSON field `projectDate` maps to column `project_date`, `coverImage` maps to `cover_image_url`, `isFeatured` maps to `is_featured`).
3. WHEN the seed SQL is executed against a freshly migrated Supabase database, THE `settings`, `categories`, `projects`, `services`, `skills`, `experiences`, `social_links`, `process_steps`, and `philosophy_items` tables SHALL each be populated with the corresponding records from `portfolio-db.json`. THE `project_images` table SHALL be seeded with zero rows (reflecting the empty `project_images` array in the source JSON). THE `messages` table SHALL be seeded with zero rows.
4. THE seed file SHALL NOT include `INSERT` statements for any `users` table, as the Admin user SHALL be created exclusively through the Supabase Auth dashboard.
5. THE seed SQL file SHALL use `INSERT ... ON CONFLICT DO NOTHING` for all insert statements so that re-executing the seed file against a database that already contains the seed data does not produce errors or duplicate rows.

---

### Requirement 12: Git Commit Conventions

**User Story:** As a developer, I want every logical change committed with a descriptive Conventional_Commit message, so that the migration history is readable and easy to revert if needed.

#### Acceptance Criteria

1. THE repository SHALL contain exactly one commit per logical migration unit, where each of the following constitutes exactly one unit: schema creation, RLS policy setup, frontend data layer replacement (`src/lib/supabase.ts`), auth migration (AdminDashboard + Supabase Auth), types update (`src/types.ts`), admin dashboard Cloudinary integration, build system update (`package.json` + `vite.config.ts`), and data seed (`supabase/seed.sql`).
2. WHEN a commit introduces functionality that did not previously exist in the codebase, THE commit message SHALL use the `feat:` prefix (e.g., `feat: add supabase data layer replacing express api`).
3. WHEN a commit removes or restructures existing code without changing observable behavior, THE commit message SHALL use the `refactor:` prefix (e.g., `refactor: remove express server and json db files`).
4. WHEN a commit resolves a defect introduced during the migration (a regression not present before the migration began), THE commit message SHALL use the `fix:` prefix.
5. THE subject line of every Conventional_Commit message SHALL be 72 characters or fewer.
6. WHEN a commit does not introduce new functionality, fix a regression, or restructure code, THE commit message SHALL use one of the following prefixes: `chore:` for maintenance tasks, `docs:` for documentation changes, `test:` for test additions or corrections, or `build:` for dependency or build configuration changes.
