import { Request, Response } from 'express';
import { getAllRecipes, getRecipesByUser, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from '../models/recipe.model';

export const getAll = async (req: Request, res: Response) => {
  try {
    // legge i filtri dalla query string es. /api/recipes?category=Pasta&username=Marco
    const { category, username } = req.query;
    const recipes = await getAllRecipes(category as string, username as string);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle ricette' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeById(Number(id));
    if (!recipe) return res.status(404).json({ message: 'Ricetta non trovata' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero della ricetta' });
  }
};

export const getMine = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const recipes = await getRecipesByUser(userId);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero delle tue ricette' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { title, description, category, emoji } = req.body;
    const userId = (req as any).userId;
    await createRecipe(title, description, category, emoji, userId);
    res.status(201).json({ message: 'Ricetta creata con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nella creazione della ricetta' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, emoji } = req.body;
    await updateRecipe(Number(id), title, description, category, emoji);
    res.json({ message: 'Ricetta aggiornata con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento della ricetta' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteRecipe(Number(id));
    res.json({ message: 'Ricetta eliminata con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione della ricetta' });
  }
};