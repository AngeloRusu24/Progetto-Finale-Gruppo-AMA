import { Request, Response } from 'express';
import { getReviewsByRecipe, createReview, deleteReview, hasUserReviewed } from '../models/review.model';
import { getRecipeById } from '../models/recipe.model';

export const getByRecipe = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const reviews = await getReviewsByRecipe(Number(recipeId));
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle recensioni' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { comment, rating, recipeId } = req.body;
    const userId = (req as any).userId;

    // controlla che la ricetta esista
    const recipe: any = await getRecipeById(Number(recipeId));
    if (!recipe) return res.status(404).json({ message: 'Ricetta non trovata' });

    // impedisce di recensire la propria ricetta
    if (recipe.user_id === userId) {
      return res.status(403).json({ message: 'Non puoi recensire la tua ricetta' });
    }

    // impedisce di recensire due volte la stessa ricetta
    const alreadyReviewed = await hasUserReviewed(userId, recipeId);
    if (alreadyReviewed) {
      return res.status(403).json({ message: 'Hai già recensito questa ricetta' });
    }

    await createReview(comment, rating, userId, recipeId);
    res.status(201).json({ message: 'Recensione aggiunta con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nella creazione della recensione' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteReview(Number(id));
    res.json({ message: 'Recensione eliminata con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione della recensione' });
  }
};