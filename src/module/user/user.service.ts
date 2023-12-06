import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
// import { Observable } from 'rxjs';
import { UserArgs } from './dto/User-args.dto';
import { NewUserInput } from './dto/new-User-input.dto';
import {
  USER_GR_PC_SERVICE_NAME,
  USER_PACKAGE_NAME,
  UserGRPCServiceClient,
} from 'src/grpc/interface/user';
import { User } from './entity/user.entity';

@Injectable()
export class UserService implements OnModuleInit {
  private usergRPCService: UserGRPCServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usergRPCService = this.client.getService<UserGRPCServiceClient>(
      USER_GR_PC_SERVICE_NAME,
    );
  }

  findOneById(id: string): Promise<User> {
    // TODO: Convert User interface from gRPC Service to GraphQL User entity
    // return this.usergRPCService.findOne({ id: id });
    console.log(id);
    return null;
  }

  findAll(userArgs: UserArgs): Promise<User[]> {
    // TODO: Convert UserList interface from gRPC Service to GraphQL [User] entity
    // const userList = this.usergRPCService.findMany({
    //   fullName: UserArgs.fullName,
    //   email: UserArgs.email,
    // });
    // return userList;
    console.log(userArgs);
    return null;
  }

  create(newUserData: NewUserInput): Promise<User> {
    // TODO: Implement Create gRPC Service
    console.log(newUserData);
    return null;
  }

  remove(id: string): Promise<User> {
    // TODO: Implement Remove gRPC Service
    console.log(id);
    return null;
  }
}
