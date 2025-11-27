import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { getRoleByName } from '../models/roleModel.js';
import { createUser, findUserByEmail } from '../models/userModel.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos' });
    }

    // Buscar rol por nombre; si no viene, usar 'usuario'
    const roleName = role || 'usuario';
    const roleObj = await getRoleByName(roleName);
    if (!roleObj) {
      return res.status(400).json({ message: 'Rol no encontrado' });
    }

    // verificar si ya existe email
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email ya registrado' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const id = await createUser({ nombre, email, password: hashed, role_id: roleObj.id });

    return res.status(201).json({ message: 'Usuario creado', id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Faltan campos' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

    // construir payload
    const payload = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role_name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // opción: devolver token y role
    return res.json({ message: 'Autenticado', token, role: user.role_name, nombre: user.nombre });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
