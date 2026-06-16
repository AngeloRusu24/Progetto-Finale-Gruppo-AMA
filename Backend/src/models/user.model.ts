import pool from '../config/db';

export const createUser = async (username: string, email: string, password: string) => {
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );
  return result;
};

export const findUserByEmail = async (email: string) => {
  const [rows]: any = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};