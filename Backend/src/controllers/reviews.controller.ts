import { Request, Response } from 'express';
import Review from '../models/review.model';
import Recipe from '../models/recipe.model';

export const getByRecipe = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle recensioni' });
  }
};

export const getMine = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const reviews = await Review.find({ user: userId })
      .populate('recipe', 'title');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle recensioni' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { comment, rating, recipeId } = req.body;
    const userId = (req as any).userId;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Ricetta non trovata' });

    if (recipe.user.toString() === userId) {
      return res.status(403).json({ message: 'Non puoi recensire la tua ricetta' });
    }

    const already = await Review.findOne({ user: userId, recipe: recipeId });
    if (already) return res.status(403).json({ message: 'Hai già recensito questa ricetta' });

    const review = await Review.create({ comment, rating, user: userId, recipe: recipeId });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Errore nella creazione della recensione' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recensione eliminata con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione della recensione' });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('user', 'username')
      .populate('recipe', 'title');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero recensioni' });
  }
};