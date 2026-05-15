import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from '../config/db';
import { env } from '../config/env';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/register', async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });
  const { email, password } = parsed.data;

  const hash = await bcrypt.hash(password, 10);
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email.toLowerCase(), hash],
    );
    const token = jwt.sign({ sub: result.insertId }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    } as jwt.SignOptions);
    return res.status(201).json({ token, user: { id: result.insertId, email } });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'email_taken' });
    throw err;
  }
});

router.post('/login', async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });
  const { email, password } = parsed.data;

  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, password_hash FROM users WHERE email = ? LIMIT 1',
    [email.toLowerCase()],
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

  const token = jwt.sign({ sub: user.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
  return res.json({ token, user: { id: user.id, email } });
});

export default router;
