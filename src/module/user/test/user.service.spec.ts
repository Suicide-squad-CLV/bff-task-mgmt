import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { USER_PACKAGE_NAME } from '../../../grpc/interface/user';
import { of, throwError } from 'rxjs';
import { mockReturnUser } from '../stubs/user.stub';
import { RpcException } from '@nestjs/microservices';

const mockUserServiceClient = {
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  removeUser: jest.fn(),
  findByCredentials: jest.fn(),
  findMany: jest.fn(),
  updatePassword: jest.fn(),
  forgotPassword: jest.fn(),
  updateAvatar: jest.fn(),
};

const mockClientGrpc = {
  getService: jest.fn(() => mockUserServiceClient),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_PACKAGE_NAME,
          useValue: mockClientGrpc,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return user when found', async () => {
      mockUserServiceClient.findOne.mockReturnValue(of(mockReturnUser));

      const result = await service.findOneById(1);

      expect(result).toEqual(mockReturnUser);
      expect(mockUserServiceClient.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw RpcException when gRPC service returns an error', async () => {
      const grpcError = 'Some gRPC error';
      mockUserServiceClient.findOne.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(service.findOneById(1)).rejects.toThrowError(
        new RpcException(grpcError),
      );
      expect(mockUserServiceClient.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return users when found', async () => {
      const keyword = 'test';
      const mockUsers = [mockReturnUser];
      mockUserServiceClient.findMany.mockReturnValue(of({ users: mockUsers }));

      const result = await service.findAll(keyword);

      expect(result).toEqual(mockUsers);
      expect(mockUserServiceClient.findMany).toHaveBeenCalledWith({
        email: keyword,
      });
    });

    it('should return an empty array when no users found', async () => {
      const keyword = 'non exist user';
      mockUserServiceClient.findMany.mockReturnValue(of({ users: [] }));

      const result = await service.findAll(keyword);

      expect(result).toEqual([]);
      expect(mockUserServiceClient.findMany).toHaveBeenCalledWith({
        email: keyword,
      });
    });

    it('should throw RpcException when gRPC service returns an error', async () => {
      const keyword = 'error';
      const grpcError = 'Some gRPC error';
      mockUserServiceClient.findMany.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(service.findAll(keyword)).rejects.toThrowError(
        new RpcException(grpcError),
      );
      expect(mockUserServiceClient.findMany).toHaveBeenCalledWith({
        email: keyword,
      });
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      const userId = 1;
      mockUserServiceClient.removeUser.mockReturnValue(of({ success: true }));

      const result = await service.remove(userId);

      expect(result).toEqual({ success: true });
      expect(mockUserServiceClient.removeUser).toHaveBeenCalledWith({
        id: userId,
      });
    });

    it('should throw RpcException when gRPC service returns an error', async () => {
      const userId = 1;
      const grpcError = 'Some gRPC error';
      mockUserServiceClient.removeUser.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(service.remove(userId)).rejects.toThrowError(
        new RpcException(grpcError),
      );

      expect(mockUserServiceClient.removeUser).toHaveBeenCalledWith({
        id: userId,
      });
    });
  });
});
