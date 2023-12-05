import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UserById } from './interface/User-by-id.interface';
import { User } from './entity/User.entity';
import { UserList } from './interface/user-list.interface';
import { UserArgs } from './dto/User-args.dto';
import { NewUserInput } from './dto/new-User-input.dto';

interface UserGRPCService {
  findOne(data: UserById): Observable<User>;
  findMany(data: UserList): Observable<User[]>;
}

@Injectable()
export class UserService implements OnModuleInit {
  private usergRPCService: UserGRPCService;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usergRPCService =
      this.client.getService<UserGRPCService>('UserGRPCService');
  }

  findOneById(id: string): Observable<User> {
    return this.usergRPCService.findOne({ id: id });
  }

  findAll(UserArgs: UserArgs): Observable<User[]> {
    return this.usergRPCService.findMany({
      fullName: UserArgs.fullName,
      email: UserArgs.email,
    });
  }

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
