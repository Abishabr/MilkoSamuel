import { Router } from 'express';
import { supabase } from '../supabase';

const router = Router();

// POST /api/messages — public contact form submission
router.post('/messages', async (req, res) => {
  const { name, email, message, subject } = req.body as {
    name?: string;
    email?: string;
    message?: string;
    subject?: string;
  };

  // Validate required fields
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'email is required' });
  }
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'message is required' });
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      subject: subject?.trim() ?? '',
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

export default router;
