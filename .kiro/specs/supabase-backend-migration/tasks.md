# Implementation Plan: Supabase Backend Migration

## Overview

Migrate Samuel Milko's portfolio from an Express + local JSON monorepo to a fully decoupled Vite SPA backed by Supabase (PostgreSQL + Auth + RLS) and Cloudinary. The Express server, JSON file, and `src/lib/api.ts` are all deleted; a new `src/lib/supabase.ts` data layer replaces them. All existing admin dashboard capabilities are preserved, the contact form gains real validation and Supabase insert, and TypeScript types are updated to snake_case.

Implementation follows the migration order defined in the design document (database → types → data layer → auth → contact form → build system → deletions → seed).

## Tasks

- [x] 1. Write the Supabase SQL migration file
  - Create `supabase/migrations/20240101000000_initial_schema.sql`
  - Define all 11 tables (`settings`, `categories`, `projects`, `project_images`, `services`, `skills`, `experiences`, `messages`, `social_links`, `process_steps`, `philosophy_items`) with their columns, types, constraints, and foreign keys exactly as specified in the design ERD
  - Add the `settings` singleton CHECK constraint (`id = '00000000-0000-0000-0000-000000000001'::uuid`)
  - Add `ON DELETE CASCADE` on `project_images.project_id`
  - Enable RLS on all 11 tables
  - Create all RLS policies per the policy matrix in the design: anon SELECT on all public tables, anon INSERT on `messages` only, authenticated full access on all tables
  - _Requirements: 1.1–1.9, 2.1–2.7_

- [x] 2. Write the seed SQL file
  - Create `supabase/seed.sql`
  - Insert all records from `data/portfolio-db.json` into the corresponding Supabase tables using snake_case column names from the field mapping table in the design
  - Use `INSERT ... ON CONFLICT DO NOTHING` on every statement
  - Seed `project_images` and `messages` with zero rows
  - Do NOT include any `INSERT` for a `users` table
  - _Requirements: 11.1–11.5_

  - [ ]* 2.1 Write property test for seed SQL idempotency
    - **Property 8: Seed SQL is idempotent**
    - Set up a Vitest test that executes `supabase/seed.sql` against a local Supabase instance twice and asserts row counts are equal after both runs
    - Use `numRuns: 100` with fast-check (fc.assert) per the testing strategy in the design
    - **Validates: Requirements 11.5**

- [x] 3. Update TypeScript interfaces in `src/types.ts`
  - Replace the existing `Project`, `Service`, `ProcessStep`, `Stat`, and `SoftwareItem` interfaces with the full set of snake_case interfaces: `Settings`, `Category`, `Project`, `ProjectImage`, `Service`, `Skill`, `Experience`, `Message`, `SocialLink`, `ProcessStep`, `PhilosophyItem`
  - Use the exact field names and nullability from Requirements 5.2–5.4
  - Remove `Stat` and `SoftwareItem` interfaces
  - Update `src/data.ts` to remove or update any imports that referenced the old interfaces
  - _Requirements: 5.1–5.6_

- [x] 4. Create `src/lib/supabase.ts` — Supabase client and data access layer
  - Install `@supabase/supabase-js` at a pinned exact version (add to `package.json` dependencies)
  - Write the env var initialization guard that throws a named `Error` before creating the client if any of the four required variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`) is missing or empty
  - Export the named `supabase` client instance using `createClient`
  - Implement all typed read functions: `getSettings`, `getCategories`, `getProjects`, `getProjectImages`, `getServices`, `getSkills`, `getExperiences`, `getSocialLinks`, `getProcessSteps`, `getPhilosophyItems`
  - Implement all typed write functions for every writable entity: `create*`, `update*`, `delete*` variants for categories, projects, project_images, services, skills, experiences, social_links, process_steps, philosophy_items, messages; plus `updateSettings`
  - All function signatures must match the design's `src/lib/supabase.ts` interface section exactly
  - _Requirements: 1.1, 4.1, 4.4, 9.4_

  - [ ]* 4.1 Write property test for missing env var initialization error
    - **Property 1: Missing env var causes named initialization error**
    - Use fast-check `fc.subarray` over the four required variable names with `minLength: 1` to generate every possible non-empty subset of missing vars
    - For each generated subset, call `initSupabaseClient(envWithout(subset))` and assert it throws an `Error` whose message contains the name of at least one missing variable
    - Set `numRuns: 100`
    - **Validates: Requirements 1.1, 9.4**

- [x] 5. Update `src/context/DataContext.tsx` to use the Supabase data layer
  - Replace the `import { api } from '../lib/api'` with `import { ... } from '../lib/supabase'`
  - Rewrite `fetchData` to call all ten Supabase read functions concurrently via `Promise.allSettled`
  - For each rejected promise, set the per-entity error string in the format `"Failed to load [entity]: [supabase error message]"` in component state — leave all other successfully loaded entities unchanged
  - For each fulfilled promise, set the corresponding state value
  - Remove the `submitContactMessage` helper from DataContext (contact form will call Supabase directly)
  - _Requirements: 4.2, 4.3_

  - [ ]* 5.1 Write property test for DataContext partial failure
    - **Property 3: DataContext partial failure leaves successful entities intact**
    - Use fast-check `fc.subarray` over the array of 10 entity names with `minLength: 1, maxLength: 9` to generate subsets of failing entities
    - Build a mock Supabase client where the specified entities reject and all others resolve with fixture data
    - Call `fetchAllWithMock(mockSupabase)` and assert: each failing entity has an error string matching `/^Failed to load/`, and each non-failing entity has its data defined and unchanged
    - Set `numRuns: 100`
    - **Validates: Requirements 4.2, 4.3**

- [x] 6. Migrate `src/components/AdminDashboard.tsx` to Supabase Auth
  - Remove all `sessionStorage` calls (`getItem('admin_token')`, `setItem`, `removeItem`)
  - Remove `authToken` state and the `hashPassword`-based login flow
  - On component mount call `supabase.auth.getSession()`: if session is non-null render the management UI directly, otherwise render the login form
  - Replace `handleLogin` to call `supabase.auth.signInWithPassword({ email, password })`; on success transition to management UI; on error display `error.message` inline on the login form without navigating away
  - Replace `handleLogout` to call `supabase.auth.signOut()` and transition back to the login form within the same render cycle
  - Replace all `api.*` import and call sites with the corresponding functions from `src/lib/supabase`
  - Update all form field names from camelCase (`projectDate`, `coverImage`, `isFeatured`, etc.) to snake_case (`project_date`, `cover_image_url`, `is_featured`, etc.) to match the new `Project` interface
  - Update the messages tab to use `is_read` (snake_case) instead of `isRead`
  - Display inline error messages on write failures in the format `"Failed to [operation] [entity]: [error message]"` and keep all form values intact
  - _Requirements: 3.1–3.6, 6.1–6.9_

  - [ ]* 6.1 Write unit tests for Supabase Auth login/logout flows
    - Mock `supabase.auth.signInWithPassword` to return success; assert dashboard management UI is shown
    - Mock `supabase.auth.signInWithPassword` to return an error; assert inline error is shown and the component does not navigate
    - Mock `supabase.auth.signOut`; assert login form is rendered after logout
    - Mock `supabase.auth.getSession` returning a non-null session; assert management UI is shown on mount without rendering the login form
    - Assert `localStorage` and `sessionStorage` do NOT contain a key `admin_token` after a successful sign-in (Property 4)
    - **Validates: Requirements 3.1–3.5**

- [x] 7. Add Cloudinary Upload Widget integration to `src/components/AdminDashboard.tsx`
  - Add the Cloudinary script tag (`https://upload-widget.cloudinary.com/global/all.js`) to `index.html`
  - Implement the `openCloudinaryUpload` utility wrapper inside `AdminDashboard` using `window.cloudinary.createUploadWidget` with the env var config, exactly as shown in the design's Cloudinary Integration Pattern section
  - Wire upload buttons for `cover_image_url`, `banner_image_url` (resourceType `image`; formats `jpg, png, gif, webp, svg`)
  - Wire upload button for `resume_url` in the settings form (resourceType `raw`; formats `pdf`)
  - Wire upload button for `project_images.image_url` in the project images section (resourceType `image`; formats `jpg, png, gif, webp, svg`)
  - On `result.event === 'success'`, write only `result.info.secure_url` to the corresponding field state — no transformation
  - On error or cancel, display inline error adjacent to the upload button and leave the URL field unchanged
  - The `video_url` field must remain a plain text input — it must NOT trigger Cloudinary
  - _Requirements: 6.5–6.8, 7.1–7.6_

  - [ ]* 7.1 Write property test for Cloudinary secure_url stored verbatim
    - **Property 5: Cloudinary secure_url is stored verbatim**
    - Use fast-check `fc.webUrl()` (or `fc.string()` prefixed with `https://res.cloudinary.com/`) to generate arbitrary `secure_url` values
    - Simulate the Cloudinary widget success callback with `{ event: 'success', info: { secure_url } }`
    - Assert the form field state equals exactly `secure_url` with no modification
    - Set `numRuns: 100`
    - **Validates: Requirements 7.3**

- [x] 8. Checkpoint — verify auth and admin dashboard compile and function
  - Ensure all TypeScript types compile with `tsc --noEmit` (zero errors)
  - Ensure no import references `../lib/api` or `./lib/api` anywhere in `src/`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Update `src/components/ContactForm.tsx` for real Supabase submission
  - Extract a pure `validateContactForm` function (suitable for unit and property testing) that validates: `name` non-empty and ≤ 100 chars, `email` contains `@` and a `.` after the `@`, `subject` non-empty and ≤ 200 chars, `message` non-empty and ≤ 5000 chars
  - On submit, run `validateContactForm`; display per-field inline error messages for any failing field and do NOT call Supabase
  - When all fields pass, disable the submit button and all input fields, then call `createMessage({ name, email, subject, message })` from `src/lib/supabase`
  - On success: show "Message sent successfully", clear all form fields, re-enable the form
  - On Supabase error: display the error message inline, re-enable the submit button and all fields, preserve all field values exactly as entered
  - Remove the `setTimeout` mock and the `submitContactMessage` import from DataContext
  - _Requirements: 8.1–8.6_

  - [ ]* 9.1 Write property test for contact form validation
    - **Property 6: Contact form validation rejects exactly the invalid inputs**
    - Use `fc.record({ name: fc.string(...), email: fc.oneof(fc.emailAddress(), fc.string()), subject: fc.string(...), message: fc.string(...) })` with ranges as shown in the design testing section
    - For each generated tuple call `validateContactForm(tuple)` and assert `isValid` matches the boolean expression from Property 6
    - Set `numRuns: 100`
    - **Validates: Requirements 8.1**

  - [ ]* 9.2 Write property test for contact form error field preservation
    - **Property 7: Contact form error preserves all field values**
    - Use `fc.record` to generate valid form tuples (all four fields passing validation)
    - Mock `createMessage` to return a Supabase error response
    - After the error handler runs, assert each form field value equals its value at the time of submission
    - Set `numRuns: 100`
    - **Validates: Requirements 8.4**

- [x] 10. Update `package.json` and `vite.config.ts` — build system cleanup
  - Change `dev` script to `"vite"`
  - Change `build` script to `"vite build"` (remove the `&& esbuild server.ts ...` segment)
  - Remove the `start` script entirely
  - Remove `express` from `dependencies`
  - Remove `@types/express`, `tsx`, and `esbuild` from `devDependencies` (esbuild is no longer used by any remaining script)
  - Add `@supabase/supabase-js` at a pinned exact version to `dependencies` if not already added in task 4
  - Inspect `vite.config.ts`; confirm no `server.proxy` block forwards `/api/*` (per the current file it does not — no changes needed)
  - Update `.env.example` to list the four Supabase and Cloudinary variables with placeholder values, replacing the existing AI Studio-specific entries
  - Verify `.gitignore` contains `.env` and `.env.local` as separate entries; add them if missing
  - _Requirements: 9.1–9.3, 10.1–10.6_

- [x] 11. Delete legacy server and data files
  - Delete `src/lib/api.ts`
  - Delete `server.ts`
  - Delete `server/db.ts`; remove the `server/` directory if it is then empty
  - Delete `data/portfolio-db.json`; remove the `data/` directory if it is then empty
  - _Requirements: 4.5, 4.6, 4.7, 3.6_

- [x] 12. Final checkpoint — full build and import verification
  - Run `tsc --noEmit` and confirm zero TypeScript errors
  - Run `grep -r "from.*lib/api" src/` and confirm zero matches
  - Run `vite build` and confirm the build succeeds
  - Run `grep -r "service_role" dist/` and confirm zero matches
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP; all other tasks are required
- The design has a Correctness Properties section — property tests are included for Properties 1, 3, 5, 6, 7, and 8 (Property 2 and 4 are integration/example tests per the design's testing strategy)
- Each task references specific requirements for traceability
- Follow the migration order from the design: schema → seed → types → supabase.ts → DataContext → AdminDashboard Auth → AdminDashboard Cloudinary → ContactForm → build cleanup → deletions
- The Admin user (`milkosamuel470@gmail.com`) must be created manually via the Supabase Auth dashboard — this is NOT a coding task and is excluded from this plan per task-type constraints
- fast-check (pinned version) + Vitest is the PBT stack as specified in the design's Testing Strategy section

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "3"] },
    { "id": 1, "tasks": ["2", "4"] },
    { "id": 2, "tasks": ["2.1", "4.1", "5"] },
    { "id": 3, "tasks": ["5.1", "6"] },
    { "id": 4, "tasks": ["6.1", "7"] },
    { "id": 5, "tasks": ["7.1", "9"] },
    { "id": 6, "tasks": ["9.1", "9.2", "10"] },
    { "id": 7, "tasks": ["11"] },
    { "id": 8, "tasks": ["12"] }
  ]
}
```
