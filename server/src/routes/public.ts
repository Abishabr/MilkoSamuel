import { Router } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET /api/settings — returns the single settings row
router.get('/settings', async (_req, res) => {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/categories — returns all categories ordered by name
router.get('/categories', async (_req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/projects — returns all projects ordered by featured_order
router.get('/projects', async (_req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('featured_order', { ascending: true, nullsFirst: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/projects/:id/images — returns all images for a project ordered by display_order
router.get('/projects/:id/images', async (req, res) => {
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', req.params.id)
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/services — returns all services ordered by display_order
router.get('/services', async (_req, res) => {
  const { data, error } = await supabase.from('services').select('*').order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/skills — returns all skills ordered by display_order
router.get('/skills', async (_req, res) => {
  const { data, error } = await supabase.from('skills').select('*').order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/experiences — returns all experiences ordered by display_order
router.get('/experiences', async (_req, res) => {
  const { data, error } = await supabase.from('experiences').select('*').order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/social-links — returns all social links
router.get('/social-links', async (_req, res) => {
  const { data, error } = await supabase.from('social_links').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/process-steps — returns all process steps ordered by display_order
router.get('/process-steps', async (_req, res) => {
  const { data, error } = await supabase.from('process_steps').select('*').order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/philosophy-items — returns all philosophy items ordered by display_order
router.get('/philosophy-items', async (_req, res) => {
  const { data, error } = await supabase.from('philosophy_items').select('*').order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
