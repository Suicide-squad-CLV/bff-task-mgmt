import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
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
    return await firstValueFrom(
      this.usergRPCService.findOne({ id }).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
    );
  }

  async findAll(keyword: string) {
    const { users } = await firstValueFrom(
      this.usergRPCService.findMany({ email: keyword }).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
    );
    return users;
  }

  async remove(id: number) {
    return await firstValueFrom(
      this.usergRPCService.removeUser({ id: id }).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
    );
  }

  async updateAvatar(id: number, avatar: string) {
    return await firstValueFrom(
      this.usergRPCService.updateAvatar({ id, avatar }).pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error));
        }),
      ),
    );
  }
}
