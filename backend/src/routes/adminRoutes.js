
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getAdmins, createAdmin, deleteAdmin, getActivityLogs } from '../controllers/adminController.js';

const router = express.Router();

// All routes require Superadmin role
router.use(authenticate, authorize('superadmin'));

router.get('/users', getAdmins);
router.post('/users', createAdmin);
router.delete('/users/:id', deleteAdmin);
router.get('/logs', getActivityLogs);

export default router;
