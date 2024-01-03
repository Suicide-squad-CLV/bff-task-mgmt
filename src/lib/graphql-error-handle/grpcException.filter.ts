import {
  ExceptionFilter,
  Catch,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Metadata, status } from '@grpc/grpc-js';
import { GraphQLError } from 'graphql';
import { HTTP_CODE_FROM_GRPC } from './errorStatus.mapper';

interface CustomException<T> {
  code: status;
  details: T;
  metadata: Metadata;
}

interface HttpCustomException {
  message: string;
  statusCode: number;
  error: string;
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: any) {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.error(exception);
    }

    // if (host.getType<GqlContextType>() === 'graphql') {
    if (exception instanceof HttpException) {
      return this.catchHttpException(exception);
    }

    return this.catchGraphqlException(exception);
  }

  private catchGraphqlException(exception: any) {
    if (!(exception instanceof RpcException)) {
      exception = new RpcException(exception);
    }

    const err = exception.getError();
    let _exception: CustomException<string>;

    if (typeof err === 'object') {
      _exception = err as CustomException<string>;
    }

    const status = HTTP_CODE_FROM_GRPC[_exception.code];
    const type = HttpStatus[status];

    throw new GraphQLError(_exception.details, {
      extensions: {
        message: err,
        statusCode: status,
        error: type,
      },
    });
  }

  private catchHttpException(exception: HttpException) {
    console.log('exception', exception);
    const _error = exception.getResponse();

    let _exception: HttpCustomException;
    if (typeof _error === 'object') {
      _exception = _error as HttpCustomException;
    }

    throw new GraphQLError(_exception.message, {
      extensions: {
        message: _exception.message,
        statusCode: _exception.statusCode,
        error: _exception.error ?? _exception.message,
      },
    });
  }
}