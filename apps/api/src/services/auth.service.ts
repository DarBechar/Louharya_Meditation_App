import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import type { LoginRequest, RegisterRequest } from '@louharya/shared';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';

function makeError(message: string, statusCode: number): Error {
  return Object.assign(new Error(message), { statusCode });
}

function signToken(userId: string, email: string) {
  return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function toPublicUser(user: { id: string; email: string; name: string; avatarUrl: string | null; createdAt: Date }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function register({ email, name, password }: RegisterRequest) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw makeError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });
  return { token: signToken(user.id, user.email), user: toPublicUser(user) };
}

export async function login({ email, password }: LoginRequest) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw makeError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw makeError('Invalid credentials', 401);

  return { token: signToken(user.id, user.email), user: toPublicUser(user) };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw makeError('User not found', 404);
  return toPublicUser(user);
}
