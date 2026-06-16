import { Router } from 'express';
import { getAll, getOne, getMine, create, update, remove } from '../controllers/recipes.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAll);                        // tutte le ricette con filtri
router.get('/mine', authMiddleware, getMine);   // solo le mie
router.get('/:id', getOne);                     // singola ricetta
router.post('/', authMiddleware, create);       // crea ricetta
router.put('/:id', authMiddleware, update);     // modifica ricetta
router.delete('/:id', authMiddleware, remove);  // elimina ricetta

export default router;