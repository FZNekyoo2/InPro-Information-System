import express from 'express';
import { login, register } from '../controllers/authController.js';

import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';

const router = express.Router();

// Rate Limiter: Max 5 login attempts per 15 mins
// Rate Limiter: Max 5 login attempts per 15 mins (Temporarily disabled for debugging)
/*
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.' },
    standardHeaders: true,
    legacyHeaders: false,
});
*/

// Validation rules
const loginValidation = [
    body('username').trim().escape().notEmpty().withMessage('Username harus diisi'),
    body('password').trim().notEmpty().withMessage('Password harus diisi')
];

router.post('/login', login);
router.post('/register', register);

export default router;
