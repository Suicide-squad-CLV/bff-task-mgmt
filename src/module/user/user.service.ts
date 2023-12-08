import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  USER_GR_PC_SERVICE_NAME,
  USER_PACKAGE_NAME,
  UserGRPCServiceClient,
} from 'src/grpc/interface/user';

@Injectable()
export class UserService implements OnModuleInit {
  private usergRPCService: UserGRPCServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usergRPCService = this.client.getService<UserGRPCServiceClient>(
      USER_GR_PC_SERVICE_NAME,
    );
  }

  async findOneById(id: number) {
    return await firstValueFrom(this.usergRPCService.findOne({ id }));
  }

  async findAll() {
    const { users } = await firstValueFrom(this.usergRPCService.findMany({}));
    return users;
  }

  async remove(id: number) {
    return await firstValueFrom(this.usergRPCService.removeUser({ id: id }));
  }
}
