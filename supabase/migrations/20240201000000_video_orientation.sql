-- =============================================================================
-- Video Orientation Migration
-- Samuel Milko Portfolio — Supabase Backend
-- =============================================================================
-- Adds native aspect-ratio support so every uploaded video (YouTube landscape,
-- TikTok / Reels / Shorts portrait, or square social posts) is stored with its
-- detected orientation and rendered in its true shape.
--
-- Additive and non-destructive: existing columns and rows are untouched.
--   • video_orientation — landscape (16:9) | portrait (9:16) | square (1:1)
--   • published         — draft/published toggle for the admin workflow
--   • created_at        — set once when the project is created
--   • updated_at        — refreshed by trigger on every edit
--   • slug              — auto-generated from title by trigger when left blank
-- =============================================================================

-- ── New columns ───────────────────────────────────────────────────────────────
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS video_orientation text
    NOT NULL DEFAULT 'landscape'
    CHECK (video_orientation IN ('landscape', 'portrait', 'square'));

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();


-- ── slugify(text) — lowercase, strip accents, collapse to hyphens ─────────────
CREATE OR REPLACE FUNCTION slugify(value text)
RETURNS text AS $$
  SELECT trim(both '-' FROM
    regexp_replace(
      regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', '-', 'g'),
      '-{2,}', '-', 'g'
    )
  );
$$ LANGUAGE sql IMMUTABLE;


-- ── Auto-generate slug from title when blank; guarantee uniqueness ────────────
CREATE OR REPLACE FUNCTION projects_set_slug()
RETURNS trigger AS $$
DECLARE
  base_slug text;
  candidate text;
  suffix    integer := 1;
BEGIN
  IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
    base_slug := slugify(NEW.title);
    IF base_slug = '' THEN
      base_slug := 'project';
    END IF;

    candidate := base_slug;
    -- Append -2, -3, … until the slug is unique (ignoring the current row on update)
    WHILE EXISTS (
      SELECT 1 FROM projects
      WHERE slug = candidate
        AND id IS DISTINCT FROM NEW.id
    ) LOOP
      suffix := suffix + 1;
      candidate := base_slug || '-' || suffix;
    END LOOP;

    NEW.slug := candidate;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ── Refresh updated_at on every edit ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION projects_touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ── Triggers ──────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_projects_set_slug ON projects;
CREATE TRIGGER trg_projects_set_slug
  BEFORE INSERT OR UPDATE OF title, slug ON projects
  FOR EACH ROW EXECUTE FUNCTION projects_set_slug();

DROP TRIGGER IF EXISTS trg_projects_touch_updated_at ON projects;
CREATE TRIGGER trg_projects_touch_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION projects_touch_updated_at();
