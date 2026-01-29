import express from 'express';
import {
  getAllTahapan,
  createTahapan,
  updateTahapan,
  updateUrutanTahapan,
  deleteTahapan
} from '../controllers/tahapanController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllTahapan);
router.post('/', authenticate, createTahapan);
router.put('/urutan', authenticate, updateUrutanTahapan);
router.put('/:id', authenticate, updateTahapan);
router.delete('/:id', authenticate, deleteTahapan);

export default router;
