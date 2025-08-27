import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET,
    expirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
  },
}));
