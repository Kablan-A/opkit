import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret';

export const jwtConfig = {
  secret: jwtSecret,
  signOptions: {
    expiresIn: '1d',
  },
} satisfies JwtModuleOptions;
