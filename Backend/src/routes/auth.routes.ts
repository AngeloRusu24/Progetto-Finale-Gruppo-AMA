import { Router } from 'express';
import { register, login, getUserById } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users/:id', getUserById); 

export default router;