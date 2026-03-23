import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  vatRate: parseFloat(process.env.VAT_RATE || '0.05'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
}));
