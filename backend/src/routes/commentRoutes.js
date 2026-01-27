import express from 'express';
import { getCommentsBySurat, addComment } from '../../controllers/commentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id/comments', getCommentsBySurat);
router.post('/:id/comments', authenticate, addComment);

export default router;
