import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../proto/restaurant.proto'),
        package: 'restaurant',
        url: 'localhost:50057',
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log('Restaurant service is running on: http://localhost:50057');
}
void bootstrap();
