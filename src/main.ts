import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { RESTAURANT_PACKAGE_NAME } from './types';

async function bootstrap() {
  void ConfigModule.forRoot({ isGlobal: true });
  const url = process.env.RESTAURANT_SERVICE_URL || 'localhost:50055';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../proto/restaurant.proto'),
        package: RESTAURANT_PACKAGE_NAME,
        url: url,
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log(`Restaurant service is running on ${url}`);
}
void bootstrap();
