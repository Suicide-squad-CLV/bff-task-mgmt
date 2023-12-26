import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { USER_GR_PC_SERVICE_NAME } from 'src/grpc/interface/user';
import { of, throwError } from 'rxjs';
import {
  TOKEN,
  mockInputUser,
  mockReturnUser,
} from 'src/module/user/stubs/user.stub';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../mocks/jwt.service';
import { ConfigService } from '@nestjs/config';
import mockedConfigService from '../mocks/config.service';

const mockUsergRPCService = {
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  removeUser: jest.fn(),
  findByCredentials: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  updatePassword: jest.fn(),
  forgotPassword: jest.fn(),
  updateAvatar: jest.fn(),
};

const mockClientGrpc = {
  getService: jest.fn(() => mockUsergRPCService),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_GR_PC_SERVICE_NAME,
          useValue: mockClientGrpc,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      mockUsergRPCService.create.mockReturnValue(of(mockReturnUser));

      const result = await service.register(mockInputUser);

      expect(result.token).toBeDefined();
      expect(result.user).toEqual(mockReturnUser);
      expect(mockUsergRPCService.create).toHaveBeenCalledWith(mockInputUser);
    });

    it('should throw RpcException when gRPC service returns an error', async () => {
      const grpcError = 'Some gRPC error';
      mockUsergRPCService.create.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(service.register(mockInputUser)).rejects.toThrowError(
        new RpcException(grpcError),
      );
      expect(mockUsergRPCService.create).toHaveBeenCalledWith(mockInputUser);
    });
  });

  describe('login', () => {
    it('should return tokens and user information', async () => {
      const result = await service.login(mockReturnUser);
      expect(result.token).toBeDefined();
      expect(result.user).toEqual(mockReturnUser);
    });
  });

  describe('profile', () => {
    it('should return user profile successfully', async () => {
      const mockProfileUser = { ...mockReturnUser, password: undefined };
      mockUsergRPCService.findOne.mockReturnValue(of(mockReturnUser));

      const result = await service.profile(mockReturnUser);

      expect(result).toEqual(mockProfileUser);
      expect(mockUsergRPCService.findOne).toHaveBeenCalledWith({
        id: mockReturnUser.id,
      });
    });

    it('should throw RpcException when gRPC service returns an error', async () => {
      const grpcError = 'Some gRPC error';
      mockUsergRPCService.findOne.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(service.profile(mockReturnUser)).rejects.toThrowError(
        new RpcException(grpcError),
      );
      expect(mockUsergRPCService.findOne).toHaveBeenCalledWith({
        id: mockReturnUser.id,
      });
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password email successfully', async () => {
      mockUsergRPCService.forgotPassword.mockReturnValue(of({}));

      const result = await service.forgotPassword({
        email: mockInputUser.email,
      });

      expect(result).toEqual({
        success: true,
        message: 'Forgot password email already sent',
      });

      expect(mockUsergRPCService.forgotPassword).toHaveBeenCalledWith({
        email: mockInputUser.email,
      });
    });

    it('should throw RpcException when gRPC service returns an error', async () => {
      const grpcError = 'Some gRPC error';
      mockUsergRPCService.forgotPassword.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(
        service.forgotPassword({ email: mockInputUser.email }),
      ).rejects.toThrowError(new RpcException(grpcError));

      expect(mockUsergRPCService.forgotPassword).toHaveBeenCalledWith({
        email: mockInputUser.email,
      });
    });
  });

  describe('updatePassword', () => {
    it('should update user password successfully', async () => {
      const passwordInput = { token: TOKEN, password: 'newPassword123' };
      mockUsergRPCService.updatePassword.mockReturnValue(of({ success: true }));

      const result = await service.updatePassword(passwordInput);

      expect(result).toEqual({ success: true });
      expect(mockUsergRPCService.updatePassword).toHaveBeenCalledWith(
        passwordInput,
      );
    });

    it('should throw RpcException when gRPC service returns an error', async () => {
      const passwordInput = { token: TOKEN, password: 'newPassword123' };
      const grpcError = 'Some gRPC error';
      mockUsergRPCService.updatePassword.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(service.updatePassword(passwordInput)).rejects.toThrowError(
        new RpcException(grpcError),
      );

      expect(mockUsergRPCService.updatePassword).toHaveBeenCalledWith(
        passwordInput,
      );
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      mockUsergRPCService.findByCredentials.mockReturnValue(of(mockReturnUser));

      const result = await service.validateUser(
        mockInputUser.email,
        mockInputUser.password,
      );

      expect(result).toEqual(mockReturnUser);
      expect(mockUsergRPCService.findByCredentials).toHaveBeenCalled();
    });

    it('should throw RpcException when gRPC service returns an error', async () => {
      const grpcError = 'Some gRPC error';
      mockUsergRPCService.findByCredentials.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(
        service.validateUser(mockInputUser.email, mockInputUser.password),
      ).rejects.toThrow(new RpcException(grpcError));
      expect(mockUsergRPCService.findByCredentials).toHaveBeenCalled();
    });

    it('should throw RpcException when user not found', async () => {
      const grpcError = 'Wrong credentials provided';
      mockUsergRPCService.findByCredentials.mockReturnValue(
        throwError(() => new Error(grpcError)),
      );

      await expect(
        service.validateUser(mockInputUser.email, mockInputUser.password),
      ).rejects.toThrow(new RpcException(grpcError));

      expect(mockUsergRPCService.findByCredentials).toHaveBeenCalled();
    });
  });
});
