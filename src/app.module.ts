import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective, GraphQLError } from 'graphql';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { upperDirectiveTransformer } from './graphql/directive/upper-case.directive';
import { TaskModule } from './module/task/task.module';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      playground: false,
      plugins: [
        // Install a landing page plugin via Apollo Sandbox based on NODE_ENV
        // Skip using ApolloServerPluginLandingPageGraphQLPlayground
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({
              graphRef: 'my-graph-id@my-graph-variant',
              footer: false,
            })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
      formatError: (error: any) => {
        const originalError = error.extensions.originalError as GraphQLError;
        if (!originalError) {
          return {
            message: error.message,
            errors: error.extensions?.message,
            code: error.extensions?.code,
            statusCode: error.extensions?.statusCode,
            error: error.extensions?.error,
          };
        }

        return {
          message: originalError.message,
          code: error.extensions?.code,
          statusCode: error.extensions?.originalError?.statusCode ?? 500,
        };
      },
    }),
    AuthModule,
    UserModule,
    TaskModule,
  ],
})
export class AppModule {}
