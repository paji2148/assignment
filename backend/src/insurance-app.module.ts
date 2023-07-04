import { Module } from '@nestjs/common';
import { InsuranceApplicationController } from './insurance-app.controller';
import { InsuranceApplicationService } from './insurance-app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './utils/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,})
  ],
  controllers: [InsuranceApplicationController],
  providers: [PrismaService, InsuranceApplicationService],
})
export class InsuranceAppModule {}
