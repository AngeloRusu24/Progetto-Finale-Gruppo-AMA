import { Request, Response } from 'express';
import Recipe from '../models/recipe.model';
import Review from '../models/review.model';

export const getAll = async (req: Request, res: Response) => {
  try {
    const { category, username } = req.query;
    const filter: any = {};
    if (category) filter.category = category;

    const recipes = await Recipe.find(filter)
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    // aggiunge la media delle recensioni a ogni ricetta
    const recipesWithRating = await Promise.all(recipes.map(async (r) => {
      const reviews = await Review.find({ recipe: r._id });
      const avg = reviews.length > 0
        ? reviews.reduce((sum, rv) => sum + rv.rating, 0) / reviews.length
        : null;
      return {
        ...r.toObject(),
        avg_rating: avg ? avg.toFixed(1) : null,
        review_count: reviews.length
      };
    }));

    // filtro per username lato server
    const filtered = username
      ? recipesWithRating.filter((r: any) =>
          r.user?.username?.toLowerCase().includes((username as string).toLowerCase()))
      : recipesWithRating;

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle ricette' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'username');
    if (!recipe) return res.status(404).json({ message: 'Ricetta non trovata' });

    const reviews = await Review.find({ recipe: recipe._id });
    const avg = reviews.length > 0
      ? reviews.reduce((sum, rv) => sum + rv.rating, 0) / reviews.length
      : null;

    res.json({
      ...recipe.toObject(),
      avg_rating: avg ? avg.toFixed(1) : null,
      review_count: reviews.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero della ricetta' });
  }
};

export const getMine = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const recipes = await Recipe.find({ user: userId }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle tue ricette' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { title, description, category, emoji } = req.body;
    const userId = (req as any).userId;
    const recipe = await Recipe.create({ title, description, category, emoji, user: userId });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Errore nella creazione della ricetta' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { title, description, category, emoji } = req.body;
    await Recipe.findByIdAndUpdate(req.params.id, { title, description, category, emoji });
    res.json({ message: 'Ricetta aggiornata con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento della ricetta' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ricetta eliminata con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione della ricetta' });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({ user: req.params.userId }).sort({ createdAt: -1 });
    const recipesWithRating = await Promise.all(recipes.map(async (r) => {
      const reviews = await Review.find({ recipe: r._id });
      const avg = reviews.length > 0
        ? reviews.reduce((sum, rv) => sum + rv.rating, 0) / reviews.length
        : null;
      return { ...r.toObject(), avg_rating: avg ? avg.toFixed(1) : null, review_count: reviews.length };
    }));
    res.json(recipesWithRating);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle ricette' });
  }
};