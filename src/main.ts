import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { RESTAURANT_PACKAGE_NAME } from './types';
import { MENU_PACKAGE_NAME } from './types/menu';

async function bootstrap() {
  void ConfigModule.forRoot({ isGlobal: true });
  const url = process.env.RESTAURANT_SERVICE_URL || '0.0.0.0:50057';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: [
          join(__dirname, '../proto/restaurant.proto'),
          join(__dirname, '../proto/menu.proto'),
        ],
        package: [RESTAURANT_PACKAGE_NAME, MENU_PACKAGE_NAME],
        url: url,
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log(`Restaurant service is running on ${url}`);
}
void bootstrap();
