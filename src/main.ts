import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  /**
   *  A hybrid application (HTTP + gRPC)
   */

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
