import express from 'express';
import { listUsers, profile } from '../controllers/userController.js';
import { authenticate, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticate, profile);
// listar usuarios solo admin
router.get('/all', authenticate, authorizeRole(['admin']), listUsers);

export default router;
