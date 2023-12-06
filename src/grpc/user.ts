/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface UserId {
  id: string;
}

export interface UserInfo {
  fullName: string;
  email: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
  hasChangePassword: boolean;
  isDeleted: boolean;
  createDate: string;
  updateDate: string;
}

export interface UserList {
  user: User[];
}

export const USER_PACKAGE_NAME = "user";

export interface UserGRPCServiceClient {
  findOne(request: UserId): Observable<User>;

  findMany(request: UserInfo): Observable<UserList>;
}

export interface UserGRPCServiceController {
  findOne(request: UserId): Promise<User> | Observable<User> | User;

  findMany(request: UserInfo): Promise<UserList> | Observable<UserList> | UserList;
}

export function UserGRPCServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "findMany"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserGRPCService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserGRPCService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_GR_PC_SERVICE_NAME = "UserGRPCService";
