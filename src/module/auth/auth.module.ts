import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
// import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
  USER_GR_PC_SERVICE_NAME,
  USER_PACKAGE_NAME,
} from '../../grpc/interface/user';
import getGrpcOptions from '../../grpc/grpc-client.options';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    PassportModule,
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
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('TOKEN_EXPIRED'),
        },
      }),
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    ConfigService,
    LocalStrategy,
    JwtStrategy,
  ],
  // exports: [AuthService, JwtService],
})
export class AuthModule {}
