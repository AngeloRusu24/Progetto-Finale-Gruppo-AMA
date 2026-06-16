import pool from '../config/db';

export const getAllRecipes = async (category?: string, username?: string) => {
  let query = `
    SELECT recipes.*, users.username,
    ROUND(AVG(reviews.rating), 1) as avg_rating,
    COUNT(reviews.id) as review_count
    FROM recipes 
    JOIN users ON recipes.user_id = users.id
    LEFT JOIN reviews ON reviews.recipe_id = recipes.id
  `;

  const params: any[] = [];
  const conditions: string[] = [];

  // filtro per categoria
  if (category) {
    conditions.push('recipes.category = ?');
    params.push(category);
  }

  // filtro per username
  if (username) {
    conditions.push('users.username LIKE ?');
    params.push(`%${username}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' GROUP BY recipes.id ORDER BY recipes.created_at DESC';

  const [rows] = await pool.execute(query, params);
  return rows;
};

export const getRecipeById = async (id: number) => {
  const [rows]: any = await pool.execute(
    `SELECT recipes.*, users.username,
     ROUND(AVG(reviews.rating), 1) as avg_rating,
     COUNT(reviews.id) as review_count
     FROM recipes
     JOIN users ON recipes.user_id = users.id
     LEFT JOIN reviews ON reviews.recipe_id = recipes.id
     WHERE recipes.id = ?
     GROUP BY recipes.id`,
    [id]
  );
  return rows[0];
};

export const getRecipesByUser = async (userId: number) => {
  const [rows] = await pool.execute(
    'SELECT * FROM recipes WHERE user_id = ?',
    [userId]
  );
  return rows;
};

export const createRecipe = async (title: string, description: string, category: string, emoji: string, userId: number) => {
  const [result] = await pool.execute(
    'INSERT INTO recipes (title, description, category, emoji, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, category, emoji, userId]
  );
  return result;
};

export const updateRecipe = async (id: number, title: string, description: string, category: string, emoji: string) => {
  const [result] = await pool.execute(
    'UPDATE recipes SET title = ?, description = ?, category = ?, emoji = ? WHERE id = ?',
    [title, description, category, emoji, id]
  );
  return result;
};

export const deleteRecipe = async (id: number) => {
  const [result] = await pool.execute(
    'DELETE FROM recipes WHERE id = ?',
    [id]
  );
  return result;
};