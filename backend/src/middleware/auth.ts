// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'No token provided'
    });
    return;
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as Request['user'];
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user.role !== role) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }
    next();
  };
};

export { authenticate, requireRole };
