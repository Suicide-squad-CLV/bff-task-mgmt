import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { NewUserInput } from './dto/new-User-input.dto';
import {
  USER_GR_PC_SERVICE_NAME,
  USER_PACKAGE_NAME,
  UserGRPCServiceClient,
  User,
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

  findOneById(id: string): Observable<User> {
    // TODO: Convert User interface from gRPC Service to GraphQL User entity
    return this.usergRPCService.findOne({ id: id });
  }

  // findAll(UserArgs: UserArgs): Observable<User[]> {
  //   // TODO: Convert UserList interface from gRPC Service to GraphQL [User] entity
  //   const stream = this.usergRPCService.findMany({
  //     fullName: UserArgs.fullName,
  //     email: UserArgs.email,
  //   });
  //   return stream.pipe(toArray());
  //   // const userList = this.usergRPCService.findMany({
  //   //   fullName: UserArgs.fullName,
  //   //   email: UserArgs.email,
  //   // });
  //   // return userList;
  // }

  create(newUserData: NewUserInput): Observable<User> {
    // TODO: Implement Create gRPC Service
    console.log(newUserData);
    return null;
  }

  remove(id: string): Observable<User> {
    // TODO: Implement Remove gRPC Service
    console.log(id);
    return null;
  }
}
