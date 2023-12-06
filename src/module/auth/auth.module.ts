import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
// import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
  USER_GR_PC_SERVICE_NAME,
  USER_PACKAGE_NAME,
} from 'src/grpc/interface/user';
import getGrpcOptions from 'src/grpc/grpc-client.options';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_GR_PC_SERVICE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return getGrpcOptions(configService, USER_PACKAGE_NAME, 'user');
        },
      },
    ]),
    ConfigModule,
    // JwtModule.registerAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     secretOrPrivateKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    //     // secret: configService.get<string>('REFRESH_TOKEN_SECRET'),
    //     signOptions: {
    //       expiresIn: configService.get<number>('TOKEN_EXPIRED'),
    //     },
    //   }),
    // }),
  ],
  providers: [AuthResolver, AuthService, ConfigService],
})
export class AuthModule {}
