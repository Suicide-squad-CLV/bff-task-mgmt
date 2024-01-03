import { GraphQLError } from 'graphql';

export const handleFormatError = (error: any) => {
  const originalError = error.extensions.originalError as GraphQLError;
  if (!originalError) {
    return {
      message: error.message,
      errors: error.extensions?.message,
      statusCode: error.extensions?.statusCode,
      error: error.extensions?.error,
    };
  }

  return {
    message: originalError.message,
    errors: originalError.stack,
    statusCode: error.extensions?.originalError?.statusCode,
    error: error.extensions?.error,
  };
};
