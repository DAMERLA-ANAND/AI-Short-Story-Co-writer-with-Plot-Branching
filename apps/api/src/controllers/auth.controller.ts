import type { Request, Response, NextFunction } from 'express';
import { RegisterRequestSchema, LoginRequestSchema, UpdateUserRequestSchema } from '@plotweaver/shared';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = RegisterRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid registration details',
            details: parsed.error.flatten().fieldErrors,
          },
        });
        return;
      }

      const result = await AuthService.register(parsed.data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = LoginRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid login details',
            details: parsed.error.flatten().fieldErrors,
          },
        });
        return;
      }

      const result = await AuthService.login(parsed.data);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
        return;
      }

      const profile = await AuthService.getProfile(req.user.id);
      res.status(200).json({ user: profile });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
        return;
      }

      const parsed = UpdateUserRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid profile update data',
            details: parsed.error.flatten().fieldErrors,
          },
        });
        return;
      }

      const updated = await AuthService.updateProfile(req.user.id, parsed.data);
      res.status(200).json({ user: updated });
    } catch (err) {
      next(err);
    }
  }
}
