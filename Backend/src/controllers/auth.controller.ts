import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'Utente registrato con successo!' });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email o username già in uso' });
    } else {
      res.status(500).json({ message: 'Errore durante la registrazione' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password errata' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        birthDate: user.birthDate,
        location: user.location
      }
    });
  } catch (err) {
    console.error('Errore login:', err);
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero utente' });
  }
};

// aggiorna i dati del profilo dell'utente loggato
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { username, bio, birthDate, location } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { username, bio, birthDate, location },
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'Utente non trovato' });

    res.json(updated);
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Username già in uso' });
    } else {
      res.status(500).json({ message: 'Errore nell\'aggiornamento del profilo' });
    }
  }
};
