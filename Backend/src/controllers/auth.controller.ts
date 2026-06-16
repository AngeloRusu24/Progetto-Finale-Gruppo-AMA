import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/user.model';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await createUser(username, email, hashed);
    res.status(201).json({ message: 'Utente registrato con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password errata' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il login' });
  }
};