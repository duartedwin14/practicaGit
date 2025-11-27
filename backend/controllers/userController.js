import { findUserById, getAllUsers } from '../models/userModel.js';

export const profile = async (req, res) => {
  try {
    // middleware auth puso req.user
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    // no devolver password
    delete user.password;
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
