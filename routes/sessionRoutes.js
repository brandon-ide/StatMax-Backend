import express from 'express';
import {
  createSession,
  getSessions,
  updateSession,
  deleteSession
} from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const sessionRoutes = express.Router();

sessionRoutes.route('/')
  .post(protect, createSession)
  .get(protect, getSessions);

sessionRoutes.route('/:id')
  .put(protect, updateSession)
  .delete(protect, deleteSession);

export default sessionRoutes;
