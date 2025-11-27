import pool from '../config/db.js';

export const getRoleById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
  return rows[0];
};

export const getRoleByName = async (nombre) => {
  const [rows] = await pool.query('SELECT * FROM roles WHERE nombre = ?', [nombre]);
  return rows[0];
};

export const getAllRoles = async () => {
  const [rows] = await pool.query('SELECT * FROM roles');
  return rows;
};
