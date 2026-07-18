import { Router } from 'express';
import { supabase } from '../supabase';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// ── Settings ──────────────────────────────────────────────────────────────────

// PUT /api/settings — update the single settings row
router.put('/settings', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('settings')
    .update(req.body)
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// ── Categories ────────────────────────────────────────────────────────────────

// POST /api/categories
router.post('/categories', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/categories/:id
router.put('/categories/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/categories/:id
router.delete('/categories/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('categories')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Projects ──────────────────────────────────────────────────────────────────

// POST /api/projects
router.post('/projects', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/projects/:id
router.put('/projects/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/projects/:id
router.delete('/projects/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('projects')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Project Images ────────────────────────────────────────────────────────────

// POST /api/projects/:id/images
router.post('/projects/:id/images', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('project_images')
    .insert({ ...req.body, project_id: req.params.id })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/project-images/:id
router.put('/project-images/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('project_images')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/project-images/:id
router.delete('/project-images/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('project_images')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Services ──────────────────────────────────────────────────────────────────

// POST /api/services
router.post('/services', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('services')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/services/:id
router.put('/services/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('services')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/services/:id
router.delete('/services/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('services')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Skills ────────────────────────────────────────────────────────────────────

// POST /api/skills
router.post('/skills', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('skills')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/skills/:id
router.put('/skills/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('skills')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/skills/:id
router.delete('/skills/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('skills')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Experiences ───────────────────────────────────────────────────────────────

// POST /api/experiences
router.post('/experiences', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('experiences')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/experiences/:id
router.put('/experiences/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('experiences')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/experiences/:id
router.delete('/experiences/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('experiences')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Messages (admin) ──────────────────────────────────────────────────────────

// GET /api/messages — list all messages (admin only)
router.get('/messages', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT /api/messages/:id
router.put('/messages/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/messages/:id
router.delete('/messages/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('messages')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Social Links ──────────────────────────────────────────────────────────────

// POST /api/social-links
router.post('/social-links', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('social_links')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/social-links/:id
router.put('/social-links/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('social_links')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/social-links/:id
router.delete('/social-links/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('social_links')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Process Steps ─────────────────────────────────────────────────────────────

// POST /api/process-steps
router.post('/process-steps', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('process_steps')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/process-steps/:id
router.put('/process-steps/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('process_steps')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/process-steps/:id
router.delete('/process-steps/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('process_steps')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// ── Philosophy Items ──────────────────────────────────────────────────────────

// POST /api/philosophy-items
router.post('/philosophy-items', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('philosophy_items')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/philosophy-items/:id
router.put('/philosophy-items/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('philosophy_items')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// DELETE /api/philosophy-items/:id
router.delete('/philosophy-items/:id', requireAuth, async (req, res) => {
  const { error, count } = await supabase
    .from('philosophy_items')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

export default router;
