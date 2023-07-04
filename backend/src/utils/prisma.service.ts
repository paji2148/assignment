import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DB_URL')
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect()
    .then(() => {
      console.log('Prisma connected');
    })
    .catch((error) => {
      console.error('Prisma connection error:', error);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  getPrismaClient(): PrismaClient {
    return this;
  }

  async enableShutdownHooks(app: any) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
