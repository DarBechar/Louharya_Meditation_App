export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
  PORT: parseInt(process.env.PORT ?? '4000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:8081'],
};
