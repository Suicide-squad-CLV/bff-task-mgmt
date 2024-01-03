## Integrate with nestjs/graphql in grpc

## **Flow**

1. When BFF service reiceve error/exception from BE side, it will throw an error/exception
2. Nestjs will catch the exception and go into our `grpcException.filter.ts`
3. We then handle the exception, convert and throw `GraphqlException`
4. Our formatError in `GraphQLModule` will catch that exception, hanlde and return as format expected

## **Setup & configuration**

### 1. Add global config

Add filter into global module `app.module.ts`

```
providers: [
  {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  }
],
```

Or directly add into `main.ts` file

```
app.useGlobalFilters(new RpcExceptionFilter());
```

### 2. Add custom handle error

Import `handleFormatError` function from `helpers.ts` and append into formatError props of `GraphQLModule` configuration

```
   GraphQLModule.forRoot<ApolloDriverConfig>({
      ... others config
      formatError: (error: any) => handleFormatError(error),
    }),
```

_Modify handleFormatError function as what we're expect_
