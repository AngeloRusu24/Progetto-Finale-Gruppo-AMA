import pool from '../config/db';

export const getReviewsByRecipe = async (recipeId: number) => {
  const [rows] = await pool.execute(
    `SELECT reviews.*, users.username 
     FROM reviews 
     JOIN users ON reviews.user_id = users.id 
     WHERE reviews.recipe_id = ?`,
    [recipeId]
  );
  return rows;
};

export const createReview = async (comment: string, rating: number, userId: number, recipeId: number) => {
  const [result] = await pool.execute(
    'INSERT INTO reviews (comment, rating, user_id, recipe_id) VALUES (?, ?, ?, ?)',
    [comment, rating, userId, recipeId]
  );
  return result;
};

export const deleteReview = async (id: number) => {
  const [result] = await pool.execute(
    'DELETE FROM reviews WHERE id = ?',
    [id]
  );
  return result;
};

export const hasUserReviewed = async (userId: number, recipeId: number) => {
  const [rows]: any = await pool.execute(
    'SELECT * FROM reviews WHERE user_id = ? AND recipe_id = ?',
    [userId, recipeId]
  );
  return rows.length > 0;
};