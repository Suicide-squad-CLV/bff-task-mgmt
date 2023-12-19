import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  USER_GR_PC_SERVICE_NAME,
  User,
  UserGRPCServiceClient,
} from 'src/grpc/interface/user';
import { catchError, firstValueFrom, throwError } from 'rxjs';
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

    const expiresIn = this.configService.get<number>('TOKEN_EXPIRED');
    const expiration = Math.floor(Date.now() / 1000) + Number(expiresIn);

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: expiration,
    });

    return {
      token: accessToken,
      expiration: expiration,
      type: 'Bearer',
    };
  }

  async register(registerDto: RegisterInput) {
    const newUser = await firstValueFrom(
      this.usergRPCService.create(registerDto).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
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
      this.usergRPCService.findOne({ id: user.id }).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
    );
    profileUser.password = undefined;
    return profileUser;
  }

  async forgotPassword(emailInput: ForgotPasswordInput) {
    await firstValueFrom(
      this.usergRPCService.forgotPassword(emailInput).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
    );
    return {
      success: true,
      message: 'Forgot password email already sent',
    };
  }

  async updatePassword(passwordInput: UpdatePasswordInput) {
    return await firstValueFrom(
      this.usergRPCService.updatePassword(passwordInput).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    return await firstValueFrom(
      this.usergRPCService.findByCredentials({ email, password }).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
    );
  }

  // async refreshToken(req: Request, res: Response): Promise<string> {
  //   const refreshToken = req.headers['refresh_token'];
  //   if (!refreshToken) {
  //     throw new UnauthorizedException('Refresh token not found');
  //   }
  //   let payload = null;
  //   try {
  //     payload = this.jwtService.verify(refreshToken, {
  //       secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
  //     });
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid or expired refresh token');
  //   }
  //   const userExists = await firstValueFrom(
  //     this.usergRPCService.findByEmail({ email: payload.sub }),
  //   );
  //   if (!userExists) {
  //     throw new BadRequestException('User no longer exists');
  //   }
  //   const expiresIn = this.configService.get<number>('TOKEN_EXPIRED');
  //   const expiration = Math.floor(Date.now() / 1000) + expiresIn;
  //   const accessToken = this.jwtService.sign(
  //     { ...payload, exp: expiration },
  //     {
  //       secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
  //     },
  //   );
  //   res.headers('access_token', accessToken, { httpOnly: true });
  //   return accessToken;
  // }
}
