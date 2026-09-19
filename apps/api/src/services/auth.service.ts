import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { prisma } from '../db.js';
import type { RegisterRequest, LoginRequest, UpdateUserRequest, UserDto } from '@plotweaver/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'plotweaver-super-secret-production-jwt-key-2025';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
  email: string;
}

export class AuthService {
  static async register(data: RegisterRequest): Promise<{ user: UserDto; token: string }> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      const error: any = new Error('A user with this email address already exists');
      error.status = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, jti: crypto.randomUUID() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Also persist session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        hasApiKey: Boolean(user.apiKey),
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async login(data: LoginRequest): Promise<{ user: UserDto; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, jti: crypto.randomUUID() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        hasApiKey: Boolean(user.apiKey),
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async getProfile(userId: string): Promise<UserDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error: any = new Error('User not found');
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      hasApiKey: Boolean(user.apiKey),
      createdAt: user.createdAt,
    };
  }

  static async updateProfile(userId: string, data: UpdateUserRequest): Promise<UserDto> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.apiKey !== undefined) updateData.apiKey = data.apiKey;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      hasApiKey: Boolean(user.apiKey),
      createdAt: user.createdAt,
    };
  }
}
