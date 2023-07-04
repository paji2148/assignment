import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { InsuranceAppModule } from './insurance-app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(InsuranceAppModule);
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
