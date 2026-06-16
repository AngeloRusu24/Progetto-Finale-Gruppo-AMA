import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import recipesRoutes from './routes/recipes.routes';
import ingredientsRoutes from './routes/ingredients.routes';
import reviewsRoutes from './routes/reviews.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/reviews', reviewsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'La Ricetta Perfetta API funzionante!' });
});

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});