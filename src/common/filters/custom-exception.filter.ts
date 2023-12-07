import { BadRequestException, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch(BadRequestException)
export class GraphQLErrorFilter implements GqlExceptionFilter {
  catch(exception: BadRequestException) {
    const res = exception.getResponse();
    console.log('res error', res);

    if (typeof res === 'object') {
      throw new ApolloError('Validation error', 'VALIDATION_ERROR', res);
    } else {
      throw new ApolloError('Bad Request');
    }
  }
}
