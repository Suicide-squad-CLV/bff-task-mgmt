import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_GR_PC_SERVICE_NAME,
  UserGRPCServiceClient,
} from 'src/grpc/interface/user';
import RegisterDto from './dto/register.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private usergRPCService: UserGRPCServiceClient;

  constructor(@Inject(USER_GR_PC_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.usergRPCService = this.client.getService<UserGRPCServiceClient>(
      USER_GR_PC_SERVICE_NAME,
    );
  }

  async register(registerDto: RegisterDto) {
    console.log('registerDto', registerDto);
    const res = await firstValueFrom(this.usergRPCService.create(registerDto));
    console.log(res);
    return res;
  }
}
