import pool from '../config/db';

export const getIngredientsByRecipe = async (recipeId: number) => {
  const [rows] = await pool.execute(
    'SELECT * FROM ingredients WHERE recipe_id = ?',
    [recipeId]
  );
  return rows;
};

export const getAllIngredients = async () => {
  const [rows] = await pool.execute(
    `SELECT ingredients.*, recipes.title as recipe_title, users.username 
     FROM ingredients 
     JOIN recipes ON ingredients.recipe_id = recipes.id 
     JOIN users ON recipes.user_id = users.id`
  );
  return rows;
};

export const getMyIngredients = async (userId: number) => {
  const [rows] = await pool.execute(
    `SELECT ingredients.*, recipes.title as recipe_title 
     FROM ingredients 
     JOIN recipes ON ingredients.recipe_id = recipes.id 
     WHERE recipes.user_id = ?`,
    [userId]
  );
  return rows;
};

export const createIngredient = async (name: string, quantity: string, recipeId: number) => {
  const [result] = await pool.execute(
    'INSERT INTO ingredients (name, quantity, recipe_id) VALUES (?, ?, ?)',
    [name, quantity, recipeId]
  );
  return result;
};

export const deleteIngredient = async (id: number) => {
  const [result] = await pool.execute(
    'DELETE FROM ingredients WHERE id = ?',
    [id]
  );
  return result;
};