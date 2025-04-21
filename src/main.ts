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
        protoPath: join(__dirname, '../restaurant.proto'), // Path to your proto file
        package: 'restaurant',
        url: 'localhost:50057', // gRPC server URL
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log('Restaurant service is running on: http://localhost:50057');
}
void bootstrap();
