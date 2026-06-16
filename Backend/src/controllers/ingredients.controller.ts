import { Request, Response } from 'express';
import { getAllIngredients, getMyIngredients, getIngredientsByRecipe, createIngredient, deleteIngredient } from '../models/ingredient.model';

export const getAll = async (req: Request, res: Response) => {
  try {
    const ingredients = await getAllIngredients();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero degli ingredienti' });
  }
};

export const getMine = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const ingredients = await getMyIngredients(userId);
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei tuoi ingredienti' });
  }
};

export const getByRecipe = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const ingredients = await getIngredientsByRecipe(Number(recipeId));
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero degli ingredienti' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, quantity, recipeId } = req.body;
    await createIngredient(name, quantity, recipeId);
    res.status(201).json({ message: 'Ingrediente aggiunto con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiunta dell\'ingrediente' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteIngredient(Number(id));
    res.json({ message: 'Ingrediente eliminato con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'ingrediente' });
  }
};