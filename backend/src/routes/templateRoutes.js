import express from 'express';
import {
  getAllTemplates,
  getTemplateById,
  uploadTemplate,
  deleteTemplate
} from '../controllers/templateController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);
router.post('/', authenticate, uploadMiddleware.single('file'), uploadTemplate);
router.delete('/:id', authenticate, deleteTemplate);

export default router;
