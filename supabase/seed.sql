-- =============================================================================
-- Seed Data
-- Samuel Milko Portfolio — Supabase Backend
-- Source: data/portfolio-db.json
-- =============================================================================
-- Re-runnable: every statement uses INSERT ... ON CONFLICT DO NOTHING
-- project_images and messages are intentionally seeded with zero rows.
-- No INSERT for any users table (admin created via Supabase Auth dashboard).
-- =============================================================================


-- ── settings (singleton) ─────────────────────────────────────────────────────
INSERT INTO settings (
  id,
  website_title,
  logo,
  theme_color,
  footer_text,
  biography,
  hero_text,
  profile_picture_url,
  resume_url,
  years_experience,
  projects_completed,
  happy_clients
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Samuel Milko | Portfolio',
  'SAMUEL MILKO',
  '#000000',
  '© 2026 Samuel Milko. All Rights Reserved.',
  'I am Samuel Milko, a multidisciplinary graphic designer and digital visual director based in Addis Ababa, Ethiopia, specializing in high-fidelity experiences that bridge raw human intuition and mathematical precision.',
  'I create eye-catching designs and engaging videos that combine creativity and strategy to help brands stand out and connect with their audience.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBDZ38TfxyqRb4zhdOToTHQ8R81gjtmltwGmQbLvq4Loe94oaP6YHB47rpSpGcUYbU2xsjiiFUrx8aQXIwMjVffL-I9LHa3gH65XaibsGFtPLN7VQ9uLT3Hz6I2KZFlPcLQT3e1r9GtdfRGhhZTvDc5JztDyGFnMmwSRlRUK1YvZ0Q-KNysyxRXKyNuOvRY6SMgMpnTfgNdDLJTvrdM-Rke6tY_IFPCSdU-MkRevFjXV4z0ko1yPzv7hCFWOY3mytZ19L01t3ZEujHy',
  '',
  '12+',
  '240',
  '185'
) ON CONFLICT DO NOTHING;


-- ── categories ───────────────────────────────────────────────────────────────
-- NOTE: categories use their original JSON id strings as the uuid-compatible
-- values by inserting them as explicit UUIDs generated deterministically.
-- Since the schema uses gen_random_uuid() by default but allows explicit ids,
-- we supply stable UUIDs so that projects can reference them via category_id.

INSERT INTO categories (id, name, slug) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Branding & Web Design',      'branding'),
  ('a0000000-0000-0000-0000-000000000002', 'Logo Design & Packaging',    'packaging'),
  ('a0000000-0000-0000-0000-000000000003', 'Video & Motion Graphics',    'video-motion')
ON CONFLICT DO NOTHING;


-- ── projects ─────────────────────────────────────────────────────────────────
-- category_id values reference the stable UUIDs inserted above.

INSERT INTO projects (
  id,
  title,
  slug,
  client,
  project_date,
  description,
  technologies,
  cover_image_url,
  banner_image_url,
  video_url,
  creative_process,
  challenges,
  final_result,
  is_featured,
  featured_order,
  category_id,
  testimonial_quote,
  testimonial_author,
  testimonial_role
) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'Aureo Studio',
  'aureo-studio',
  'Architecture Studio',
  '2024',
  'High-contrast geometric brand identity and responsive web design built for an elite brutalist architecture studio.',
  ARRAY['BRANDING', 'WEB DESIGN', 'ART DIRECTION'],
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD5ejyOewyOe4JNOu1b9uD4cZC5PcPqqtUMHCbqX3HwaAl2Vm4xPSnAQfct7QCxc50x1N5dVdImQRQRcwIcMaTnMMax6hmqA-7Foxf-zMRsYPtSP4ej9HaRSMDB8VR03Cg8u3a01lj2iGGM_Oo4y4xckeIrZxbBeqNv1zS1Q1nHevx_DEk7iYrTe-ERAcgJ2jchKwFCmW4Dq53nasr04XSEkw-l38pB9BoHmpSksqRie5nYKcq_znwFOBOLA0tjiDaivjb_owjygA',
  '',
  '',
  'We designed a custom modular wordmark based on a strict spatial grid. For the digital portfolio, we crafted an immersive high-contrast dark experience utilizing fullscreen images, brutalist typography layouts, and motion-synchronized transitions that echo the experience of walking through physical concrete spaces.',
  'Aureo Studio needed a brand presence that reflected their uncompromising architectural philosophy—raw materials, absolute geometric precision, and functional honesty. Their previous identity felt overly corporate and soft, failing to attract high-end developers and institutions.',
  'An award-winning identity that positioned Aureo Studio as a leading architectural visionary. The web launch saw a 140% increase in inquiries from premium developers and won several prestigious design awards for layout and typography.',
  true,
  1,
  'a0000000-0000-0000-0000-000000000001',
  NULL,
  NULL,
  NULL
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Vanta Skin',
  'vanta-skin',
  'Premium Skincare',
  '2024',
  'Premium packaging suite and dark-themed visual identity for an obsidian-infused luxury skincare brand.',
  ARRAY['LOGO DESIGN', 'PACKAGING', 'VISUAL ID'],
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBUlX8xWREO-wMCVu5W-cJZAeJsU6Uoohjjv_RviLkpLmCgHGHhq0Vv0ca8RqrES0lga9RT4UbBYHo67egMvgmWjgHCXw1-6DDi6NDCFTH_hN_Jk-GT__1ZJG1DS5EseEFoE0buawpVqqinCiBJWlc5UmK1WzsFNbMoX8lrQeUFiiyinOf_4ntu7pu32xl1rAp37yXOJc0eoLKS5LM9KvwJVQHszXTgI8TWptE3rvGo3OQtAT0grb3n-Pk2w5RgGaNyTcXOg95X0Q',
  '',
  '',
  'We engineered custom matte-black containers with high-contrast gloss-varnish typography and a pure gold serif monogram. The digital launch campaign combined hyper-realistic macro product photography with liquid simulation video reels highlighting the texture and mineral purity of the formula.',
  'Entering a highly saturated luxury skincare market, Vanta Skin needed to stand out instantly on premium retail shelves. Their products feature rare activated obsidian minerals, requiring a packaging story that felt mysterious, scientific, and incredibly high-end.',
  'Vanta Skin secured exclusive distribution deals with top-tier retailers in New York and Paris within three months of the design launch, exceeding initial retail targets by 210%.',
  true,
  2,
  'a0000000-0000-0000-0000-000000000002',
  NULL,
  NULL,
  NULL
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Wildhorn',
  'wildhorn',
  'Outdoor Apparel',
  '2024',
  'Monochrome campaign design and adventurous outdoor art direction for a premium alpine technical apparel line.',
  ARRAY['GRAPHIC DESIGN', 'PHOTOGRAPHY', 'CAMPAIGN'],
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA_1Jp4IN5CvlvFiEqkHOFSu2u7Jh9pEKrTKIRtczpefS3h98p5jBCGAY2E5goKiauDEp8fgJNBdP_iXGVOLSeMv5GPhAcOe6gcoEsk2cx2h2JiakerqqubnMumBz-iSXVVWLIzvI5MssqQ4hXBKHa5DI9ekTc-n7xA7cj3S1aL3xEhwUHhjfFnMpEvf111o3QEw7_i6QsB3Hz7gW1G8Nul929nsKr8GIP-JeLP6Mk12P3jrsgbL2rSQ-PvdHNm4LWQ1ftrQiBkRA',
  '',
  '',
  'We designed a high-contrast monochrome print campaign paired with dramatic, low-angle aerial mountain photography. The layout paired technical specifications in microscopic monospaced typeface with massive, tracking-expanded displays of rugged peaks.',
  'Wildhorn was launching their extreme alpine technical gear. They wanted a campaign that eschewed traditional bright outdoor sports aesthetics in favor of a timeless, raw, mountain-shrouded editorial narrative that appealed to modern urban explorers.',
  'The campaign drove a record-breaking winter pre-order cycle, completely selling out the technical outerwear collection in less than 3 weeks and establishing a highly distinct visual trademark for the brand.',
  true,
  3,
  'a0000000-0000-0000-0000-000000000001',
  NULL,
  NULL,
  NULL
),
(
  'b0000000-0000-0000-0000-000000000004',
  'Nexus Finance',
  'nexus-finance',
  'Fintech Platform',
  '2023',
  'Sleek, dark-mode financial analytics interface design and kinetic platform walkthrough animations.',
  ARRAY['UI/UX DESIGN', 'MOTION GRAPHICS', 'ANALYTICS'],
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCdZ6uQszJ6CikccCa9ms7Pjxrfw4p93vvVQjgbpHOlZiYP3YhP7Yx0c-bQtRGA_nn9tEupwN2229NwxFPzeLR9koEk8GCvLkXX9I_3WMZBkWCaQV2hXdJFDDh8ZxC0fwTeC7HQc9nuKX3QyrhmUMpFcu7ckh_Z5BygA2QpqbwbdqGhhw1xHejQw5B8FXObGv8EgqQR8xPig3kPk5vA_4RkqSZCitNee_SzAD-J75_KaWP1HAxPfGC5jeDH2-LNVAu0Df_ahsHBuA',
  '',
  '',
  'We completely redesigned the application around a minimalist, structured dashboard layout, utilizing custom dark-mode typography and adaptive neon metrics highlights. We added kinetic entry animations and interactive tooltips to ease users into the platform workflow seamlessly.',
  'Nexus Finance features highly complex real-time algorithmic market analytics. Users were overwhelmed by massive dashboards of raw data, resulting in low session times and an elevated churn rate on trial signups.',
  'User retention increased by 65% in the first month following the redesign. Walkthrough completion rates spiked by 90% as the platform began to feel less like a complex terminal and more like an elegant instrument.',
  true,
  4,
  'a0000000-0000-0000-0000-000000000003',
  NULL,
  NULL,
  NULL
)
ON CONFLICT DO NOTHING;


-- ── project_images ────────────────────────────────────────────────────────────
-- Intentionally empty — source JSON has an empty project_images array.
-- No INSERT statements.


-- ── services ─────────────────────────────────────────────────────────────────
INSERT INTO services (id, name, description, icon, display_order) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Graphic Design',    'High-impact visual communication and brand assets designed for absolute clarity, structure, and resonance.',                                                                       'PenTool',  1),
  ('c0000000-0000-0000-0000-000000000002', 'Brand Identity',    'Comprehensive visual systems, typography rules, and grid-based guidelines that translate core values into a cohesive narrative.',                                                    'Globe',    2),
  ('c0000000-0000-0000-0000-000000000003', 'Video Editing',     'Rhythmic storytelling through precise cuts, professional pacing, sound design, and compelling narrative-driven masterpieces.',                                                       'Video',    3),
  ('c0000000-0000-0000-0000-000000000004', 'Motion Graphics',   'Bringing static brands to life with fluid animations, sophisticated physics, and sleek kinetic typography.',                                                                         'Zap',      4),
  ('c0000000-0000-0000-0000-000000000005', 'Editorial Design',  'Premium publication layouts, digital journals, and book architectures that leverage generous whitespace and typography.',                                                            'BookOpen', 5)
ON CONFLICT DO NOTHING;


-- ── skills ───────────────────────────────────────────────────────────────────
INSERT INTO skills (id, name, percentage, icon, display_order) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Graphic Design',        98, 'Paintbrush', 1),
  ('d0000000-0000-0000-0000-000000000002', 'Video Editing',         96, 'Video',      2),
  ('d0000000-0000-0000-0000-000000000003', 'Brand Identity Design', 94, 'Award',      3),
  ('d0000000-0000-0000-0000-000000000004', 'Motion Graphics',       92, 'Zap',        4),
  ('d0000000-0000-0000-0000-000000000005', 'Adobe Creative Suite',  97, 'Cpu',        5)
ON CONFLICT DO NOTHING;


-- ── experiences ──────────────────────────────────────────────────────────────
INSERT INTO experiences (id, company, position, description, start_date, end_date, display_order) VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'Aura Creative Studio',
    'Lead Digital Visual Director',
    'Directed brand communication and package architectures for global luxury brands.',
    '2022',
    'Present',
    1
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'Prime Motion Co.',
    'Senior Graphic Designer & Video Editor',
    'Edited commercial campaigns and structured promotional digital identity elements.',
    '2019',
    '2022',
    2
  )
ON CONFLICT DO NOTHING;


-- ── messages ─────────────────────────────────────────────────────────────────
-- Intentionally empty — source JSON has an empty messages array.
-- No INSERT statements.


-- ── social_links ─────────────────────────────────────────────────────────────
INSERT INTO social_links (id, platform, url) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'Telegram',  'https://t.me/milkosamuel470'),
  ('f0000000-0000-0000-0000-000000000002', 'WhatsApp',  'https://wa.me/251902782218')
ON CONFLICT DO NOTHING;


-- ── process_steps ─────────────────────────────────────────────────────────────
INSERT INTO process_steps (id, number, title, description, display_order) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    '01',
    'Discover',
    'We start with an intensive, structured conversation to understand your business objectives, target audience demographics, and core creative challenges.',
    1
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    '02',
    'Strategize',
    'I perform rigorous industry research, structure a tailored visual direction, and align a roadmap aligned with your brand positioning goals.',
    2
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    '03',
    'Design',
    'I design with absolute intention and geometric rigor, crafting and refining multiple options down to a singular, cohesive masterpiece.',
    3
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    '04',
    'Develop',
    'I build, optimize, and thoroughly test assets across physical and digital formats to ensure optimal performance, scaling, and clarity.',
    4
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    '05',
    'Launch',
    'We deploy your project to the world. I continue to provide close support to monitor engagement, guide asset usage, and help your brand evolve.',
    5
  )
ON CONFLICT DO NOTHING;


-- ── philosophy_items ──────────────────────────────────────────────────────────
INSERT INTO philosophy_items (id, title, description, display_order) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Clarity',
    'Simplicity is not minimalism. It is making the complex feel entirely effortless and transparent.',
    1
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Function',
    'Design must serve a strategic purpose first, removing friction and guiding user interaction naturally.',
    2
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Impact',
    'Great design leaves an indelible, lasting visual memory and drives measurable growth and outcomes.',
    3
  )
ON CONFLICT DO NOTHING;
