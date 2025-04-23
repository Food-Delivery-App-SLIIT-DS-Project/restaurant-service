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
        // Register multiple proto files
        protoPath: [
          join(__dirname, '../restaurant.proto'),
          join(__dirname, '../menu.proto'),
        ],
        package: ['restaurant', 'menu'],
        url: 'localhost:50057', // gRPC server URL
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log(
    'Microservice restuarant & menue is running on: http://localhost:50057',
  );
}
void bootstrap();
