import pool from '../config/db.js';

export const createUser = async ({ nombre, email, password, role_id }) => {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password, role_id) VALUES (?, ?, ?, ?)',
    [nombre, email, password, role_id]
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT u.*, r.nombre as role_name FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE u.email = ?', [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT u.*, r.nombre as role_name FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE u.id = ?', [id]);
  return rows[0];
};

export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT u.id, u.nombre, u.email, r.nombre as role_name, u.creado_at FROM usuarios u JOIN roles r ON u.role_id = r.id');
  return rows;
};
