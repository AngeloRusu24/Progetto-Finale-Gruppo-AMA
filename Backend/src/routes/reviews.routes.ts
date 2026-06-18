import { Router } from 'express';
import { getByRecipe, create, remove, getMine, getByUser } from '../controllers/reviews.controller';
import { authMiddleware } from '../middleware/auth.middleware';



const router = Router();

router.get('/mine', authMiddleware, getMine);       // le mie recensioni
router.get('/recipe/:recipeId', getByRecipe);       // recensioni di una ricetta
router.post('/', authMiddleware, create);            // aggiungi recensione
router.delete('/:id', authMiddleware, remove);      // elimina recensione
router.get('/user/:userId', getByUser);


export default router;