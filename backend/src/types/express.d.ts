import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        email: string;
        role: 'admin' | 'employee';
      } & JwtPayload;
    }
  }
}

export {};
