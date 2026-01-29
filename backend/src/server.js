import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import pegawaiRoutes from './routes/pegawaiRoutes.js';
import suratRoutes from './routes/suratRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import tahapanRoutes from './routes/tahapanRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/surat', suratRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/surat', commentRoutes); // Comment routes
app.use('/api/tahapan', tahapanRoutes); // Tahapan routes
app.use('/api/dashboard', dashboardRoutes); // Dashboard routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'InPro API is running' });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 InPro Backend running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});

export default app;
