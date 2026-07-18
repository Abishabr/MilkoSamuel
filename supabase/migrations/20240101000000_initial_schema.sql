-- =============================================================================
-- Initial Schema Migration
-- Samuel Milko Portfolio — Supabase Backend
-- =============================================================================

-- ── settings (singleton) ─────────────────────────────────────────────────────
CREATE TABLE settings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
                        CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid),
  website_title       text,
  logo                text,
  theme_color         text,
  footer_text         text,
  biography           text,
  hero_text           text,
  profile_picture_url text,
  resume_url          text,
  years_experience    text,
  projects_completed  text,
  happy_clients       text
);

-- ── categories ───────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name  text NOT NULL,
  slug  text UNIQUE NOT NULL
);

-- ── projects ─────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text NOT NULL,
  slug                text UNIQUE NOT NULL,
  client              text,
  project_date        text,
  description         text,
  technologies        text[],
  cover_image_url     text,
  banner_image_url    text,
  video_url           text,
  creative_process    text,
  challenges          text,
  final_result        text,
  is_featured         boolean DEFAULT false,
  featured_order      integer,
  category_id         uuid REFERENCES categories (id),
  testimonial_quote   text,
  testimonial_author  text,
  testimonial_role    text
);

-- ── project_images ────────────────────────────────────────────────────────────
CREATE TABLE project_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  image_url     text NOT NULL,
  caption       text,
  display_order integer
);

-- ── services ─────────────────────────────────────────────────────────────────
CREATE TABLE services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  description   text,
  icon          text,
  display_order integer
);

-- ── skills ───────────────────────────────────────────────────────────────────
CREATE TABLE skills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  percentage    integer CHECK (percentage >= 0 AND percentage <= 100),
  icon          text,
  display_order integer
);

-- ── experiences ──────────────────────────────────────────────────────────────
CREATE TABLE experiences (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company       text,
  position      text,
  description   text,
  start_date    text,
  end_date      text,
  display_order integer
);

-- ── messages ─────────────────────────────────────────────────────────────────
CREATE TABLE messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text,
  message    text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read    boolean DEFAULT false
);

-- ── social_links ─────────────────────────────────────────────────────────────
CREATE TABLE social_links (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url      text NOT NULL
);

-- ── process_steps ─────────────────────────────────────────────────────────────
CREATE TABLE process_steps (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number        text,
  title         text NOT NULL,
  description   text,
  display_order integer
);

-- ── philosophy_items ──────────────────────────────────────────────────────────
CREATE TABLE philosophy_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  display_order integer
);


-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE services        ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills          ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences     ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links    ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps   ENABLE ROW LEVEL SECURITY;
ALTER TABLE philosophy_items ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- RLS Policies — settings
-- =============================================================================

CREATE POLICY "public_select_settings"
  ON settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_settings"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — categories
-- =============================================================================

CREATE POLICY "public_select_categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — projects
-- =============================================================================

CREATE POLICY "public_select_projects"
  ON projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — project_images
-- =============================================================================

CREATE POLICY "public_select_project_images"
  ON project_images FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_project_images"
  ON project_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — services
-- =============================================================================

CREATE POLICY "public_select_services"
  ON services FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — skills
-- =============================================================================

CREATE POLICY "public_select_skills"
  ON skills FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — experiences
-- =============================================================================

CREATE POLICY "public_select_experiences"
  ON experiences FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_experiences"
  ON experiences FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — messages
-- anon: INSERT only (no SELECT/UPDATE/DELETE)
-- authenticated: full access
-- =============================================================================

CREATE POLICY "anon_insert_messages"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "admin_all_messages"
  ON messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — social_links
-- =============================================================================

CREATE POLICY "public_select_social_links"
  ON social_links FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_social_links"
  ON social_links FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — process_steps
-- =============================================================================

CREATE POLICY "public_select_process_steps"
  ON process_steps FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_process_steps"
  ON process_steps FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RLS Policies — philosophy_items
-- =============================================================================

CREATE POLICY "public_select_philosophy_items"
  ON philosophy_items FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_philosophy_items"
  ON philosophy_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
