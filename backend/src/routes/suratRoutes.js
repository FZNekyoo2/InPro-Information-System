import express from 'express';
import {
  getAllSurat,
  getSuratById,
  createSurat,
  updateSurat,
  deleteSurat,
  trackSurat,
  uploadAttachment
} from '../controllers/suratController.js';
import { toggleStarSurat } from '../controllers/suratStarController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllSurat);
router.get('/track', trackSurat); // Ubah jadi query parameter
router.get('/:id', getSuratById);
router.post('/', authenticate, createSurat);
router.put('/:id', authenticate, updateSurat);
router.delete('/:id', authenticate, deleteSurat);
router.post('/:id/attachment', authenticate, uploadMiddleware.single('attachment'), uploadAttachment);
router.put('/:id/star', authenticate, toggleStarSurat);

export default router;
