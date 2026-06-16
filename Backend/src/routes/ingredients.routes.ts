import { Router } from 'express';
import { getAll, getMine, getByRecipe, create, remove } from '../controllers/ingredients.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAll);                              // tutti gli ingredienti
router.get('/mine', authMiddleware, getMine);         // i miei ingredienti
router.get('/recipe/:recipeId', getByRecipe);         // ingredienti per ricetta
router.post('/', authMiddleware, create);             // aggiungi ingrediente
router.delete('/:id', authMiddleware, remove);        // elimina ingrediente

export default router;