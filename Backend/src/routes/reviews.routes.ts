import { Router } from 'express';
import { getByRecipe, create, remove, getMine } from '../controllers/reviews.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const router = Router();

router.get('/recipe/:recipeId', getByRecipe);       // recensioni di una ricetta
router.post('/', authMiddleware, create);            // aggiungi recensione
router.delete('/:id', authMiddleware, remove);      // elimina recensione
router.get('/mine', authMiddleware, getMine);

export default router;