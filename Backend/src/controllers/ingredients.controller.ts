import { Request, Response } from 'express';
import Ingredient from '../models/ingredient.model';

export const getAll = async (req: Request, res: Response) => {
  try {
    const ingredients = await Ingredient.find()
      .populate({ path: 'recipe', populate: { path: 'user', select: 'username' } });
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero degli ingredienti' });
  }
};

export const getMine = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const ingredients = await Ingredient.find()
      .populate({ path: 'recipe', populate: { path: 'user', select: 'username' } });
    const mine = ingredients.filter((i: any) => i.recipe?.user?._id?.toString() === userId);
    res.json(mine);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei tuoi ingredienti' });
  }
};

export const getByRecipe = async (req: Request, res: Response) => {
  try {
    const ingredients = await Ingredient.find({ recipe: req.params.recipeId });
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero degli ingredienti' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, quantity, recipeId } = req.body;
    const ingredient = await Ingredient.create({ name, quantity, recipe: recipeId });
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiunta dell\'ingrediente' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ingrediente eliminato con successo!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'ingrediente' });
  }
};