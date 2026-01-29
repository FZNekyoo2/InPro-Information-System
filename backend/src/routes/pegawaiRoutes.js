import express from 'express';
import {
  getAllPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai,
  getPegawaiByNip
} from '../controllers/pegawaiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPegawai);
router.get('/nip/:nip', getPegawaiByNip);
router.get('/:id', getPegawaiById);
router.post('/', authenticate, createPegawai);
router.put('/:id', authenticate, updatePegawai);
router.delete('/:id', authenticate, deletePegawai);

export default router;
