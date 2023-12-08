import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_GR_PC_SERVICE_NAME,
  User,
  UserGRPCServiceClient,
} from 'src/grpc/interface/user';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import RegisterInput from './dto/register.dto';
import { JwtPayload, Token } from './types/token.type';
import ForgotPasswordInput from './dto/forgotPassword.dto';
import UpdatePasswordInput from './dto/updatePassword.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private usergRPCService: UserGRPCServiceClient;

  constructor(
    @Inject(USER_GR_PC_SERVICE_NAME) private client: ClientGrpc,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.usergRPCService = this.client.getService<UserGRPCServiceClient>(
      USER_GR_PC_SERVICE_NAME,
    );
  }

  private async getTokens(id: number, email: string): Promise<Token> {
    const jwtPayload: JwtPayload = {
      sub: id,
      email: email,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    return {
      token: accessToken,
      expiration: this.configService.get<number>('TOKEN_EXPIRED'),
      type: 'Bearer',
    };
  }

  async register(registerDto: RegisterInput) {
    const newUser = await firstValueFrom(
      this.usergRPCService.create(registerDto),
    );

    return {
      token: await this.getTokens(newUser.id, newUser.email),
      user: newUser,
    };
  }

  async login(user: User) {
    return {
      token: await this.getTokens(user.id, user.email),
      user: user,
    };
  }

  async profile(user: User): Promise<User> {
    const profileUser = await firstValueFrom(
      this.usergRPCService.findOne({ id: user.id }),
    );
    profileUser.password = undefined;
    return profileUser;
  }

  async forgotPassword(emailInput: ForgotPasswordInput) {
    await firstValueFrom(this.usergRPCService.forgotPassword(emailInput));
    return {
      success: true,
      message: 'Forgot password email already sent',
    };
  }

  async updatePassword(passwordInput: UpdatePasswordInput) {
    return await firstValueFrom(
      this.usergRPCService.updatePassword(passwordInput),
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    return await firstValueFrom(
      this.usergRPCService.findByCredentials({ email, password }),
    );
  }
}
