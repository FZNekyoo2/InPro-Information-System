import express from 'express';
import {
  addTracking,
  getTrackingBySurat,
  updateTracking
} from '../controllers/trackingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, addTracking);
router.get('/surat/:suratId', getTrackingBySurat);
router.put('/:id', authenticate, updateTracking);

export default router;
