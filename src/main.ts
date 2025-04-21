import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { RESTAURANT_PACKAGE_NAME } from './types';

async function bootstrap() {
  void ConfigModule.forRoot({ isGlobal: true });
  const host = process.env.GRPC_HOST || 'localhost';
  const port = process.env.GRPC_PORT || '50057';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../proto/restaurant.proto'),
        package: RESTAURANT_PACKAGE_NAME,
        url: `${host}:${port}`,
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log(`Restaurant service is running on: grpc://${host}:${port}`);
}
void bootstrap();
