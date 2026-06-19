// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import invitationRoutes from './routes/invitations';
import notificationRoutes from './routes/notifications';
import employeeRoutes from './routes/employees';
import leaderboardRoutes from './routes/leaderboard';
import { errorHandler } from './middleware/errorHandler';
import { startTaskCron } from './cron/taskCron';
import { createServer } from 'http';
import socketService from './services/socketService';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
socketService.initialize(httpServer);

// Trust proxy (required for Render, which runs behind a reverse proxy)
app.set('trust proxy', 1);

// CORS must be before helmet so preflight OPTIONS requests work
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://workwave-six.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// 404 catch-all for unknown API routes
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Centralized error handler (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startTaskCron();
});
