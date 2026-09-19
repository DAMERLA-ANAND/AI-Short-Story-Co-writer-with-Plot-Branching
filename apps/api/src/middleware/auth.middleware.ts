import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  apiKey?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const payload = await AuthService.verifyToken(token);
  if (payload) {
    const user = await AuthService.getUserById(payload.userId);
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        apiKey: user.apiKey,
      };
    }
  }
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token is required to access this resource',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = await AuthService.verifyToken(token);
  if (!payload) {
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Authentication token is invalid or expired',
      },
    });
    return;
  }

  const user = await AuthService.getUserById(payload.userId);
  if (!user) {
    res.status(401).json({
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User belonging to this token no longer exists',
      },
    });
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    apiKey: user.apiKey,
  };

  next();
}
