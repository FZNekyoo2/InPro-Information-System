import express from 'express';
import path from 'path';
import fs from 'fs';
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
import adminRoutes from './routes/adminRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
import helmet from 'helmet';
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for images/assets
// }));

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
app.use('/api/admin', adminRoutes); // Superadmin routes
app.use('/api/settings', settingsRoutes); // Application settings

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'InPro API is running' });
});

// Error handling
app.use(errorHandler);

// 404 handler
// Serve frontend static files (Production)
const frontendPath = path.join(__dirname, '../../dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // 404 handler for API only if frontend not present
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 InPro Backend running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});

export default app;
