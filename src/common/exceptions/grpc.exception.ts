import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Metadata, status } from '@grpc/grpc-js';
import { ErrorStatusMapper } from '../utils/errorStatus.mapper';
import { GraphQLError } from 'graphql';

interface CustomException<T> {
  code: status;
  details: T;
  metadata: Metadata;
}

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException) {
    const err = exception.getError();
    let _exception: CustomException<string>;

    if (typeof err === 'object') {
      _exception = err as CustomException<string>;
    }

    const mapper = new ErrorStatusMapper();
    const status = mapper.grpcToHttpMapper(_exception.code);
    const type = HttpStatus[status];

    throw new GraphQLError(_exception.details, {
      extensions: {
        message: _exception.details,
        statusCode: status,
        error: type,
      },
    });
  }
}
