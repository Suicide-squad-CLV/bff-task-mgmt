import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { RpcExceptionFilter } from './common/exceptions/grpc.exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // for catching error
  // app.useGlobalFilters(new RpcExceptionFilter());

  // fix: favicon not found when add CustomExceptionFilter
  app.use((req, res, next) => {
    if (req.originalUrl?.includes('favicon.ico')) {
      return res.sendStatus(204);
    }
    next();
  });

  app.enableCors({
    origin: configService.get<string>('APP_FRONTEND_URL'),
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 1024 * 1024 * 1024, maxFiles: 10 }),
  );

  app.useStaticAssets(join(__dirname, '..'));

  // for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // exceptionFactory: (validationErrors: any) => {
      //   return new BadRequestException(validationErrors);
      // },
    }),
  );

  const port = configService.get<number>('PORT');
  await app.listen(port, () => {
    console.log('BFF listening on port ' + port);
  });
}
bootstrap();
