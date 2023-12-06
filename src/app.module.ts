import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { upperDirectiveTransformer } from './graphql/directive/upper-case.directive';
import { TaskModule } from './module/task/task.module';
import { UserModule } from './module/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  USER_PACKAGE_NAME,
  protobufPackage as USER_PROTOBUF_PACKAGE,
} from './grpc/interface/user';
import {
  TASK_PACKAGE_NAME,
  protobufPackage as TASK_PROTOBUF_PACKAGE,
} from './grpc/interface/task';

@Module({
  imports: [
    TaskModule,
    UserModule,
    ClientsModule.register([
      {
        name: TASK_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '',
          package: TASK_PROTOBUF_PACKAGE,
          protoPath: [join(__dirname, './proto/task.proto')],
        },
      },
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '',
          package: USER_PROTOBUF_PACKAGE,
          protoPath: [join(__dirname, './proto/user.proto')],
        },
      },
    ]),
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
    }),
  ],
})
export class AppModule {}
