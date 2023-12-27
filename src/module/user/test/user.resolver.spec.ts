import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '../user.resolver';
import { UserService } from '../user.service';
import { Response, User } from 'src/grpc/interface/user';
import { mockReturnUser } from '../stubs/user.stub';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { GQLTask } from 'src/module/task/entity/task.entity';
import * as fs from 'fs';

jest.mock('fs');

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOneById: jest.fn(),
            remove: jest.fn(),
            updateAvatar: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedResult: User[] = [mockReturnUser];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const keyword = 'test';
      const result = await resolver.getUsers(keyword);

      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(keyword);
    });
  });

  describe('findOneById', () => {
    it('should return a user based on the id', async () => {
      const findingId = '1';
      const expectedResult: User = mockReturnUser;

      jest.spyOn(service, 'findOneById').mockResolvedValue(expectedResult);

      const result = await resolver.getDetailUser(findingId);

      expect(result).toBe(expectedResult);
      expect(service.findOneById).toHaveBeenCalledWith(+findingId);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const id = '1';
      const expectedData: Response = {
        success: true,
        message: 'Success',
      };
      jest.spyOn(service, 'remove').mockResolvedValue(expectedData);

      const result = await resolver.removeUser(id);

      expect(result).toBe(expectedData);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });

  describe('updateUserAvatar', () => {
    it('should update user avatar successfully', async () => {
      const userId = '1';
      const file: GraphQLUpload = {
        createReadStream: jest.fn(),
        encoding: 'utf-8',
        filename: 'avatar.jpg',
        mimetype: 'image/jpeg',
        fieldName: 'test-file',
      };
      const pathFile = 'http://localhost:5001/uploads/test-file.jpg';

      jest
        .spyOn(resolver as any, 'storeImageAndGetURL')
        .mockResolvedValue(pathFile);

      (
        jest.spyOn(resolver as any, 'storeImageAndGetURL') as jest.Mock
      ).mockResolvedValue(pathFile);

      jest
        .spyOn(service, 'updateAvatar')
        .mockResolvedValue({ ...mockReturnUser, avatar: pathFile });

      const result = await resolver.updateUserAvatar(userId, file);

      expect(result).toEqual({ ...mockReturnUser, avatar: pathFile });

      const storeImageAndGetURL = (resolver as any).storeImageAndGetURL;
      expect(storeImageAndGetURL).toHaveBeenCalled();
      expect(service.updateAvatar).toHaveBeenCalledWith(+userId, pathFile);
    });
  });

  describe.skip('storeImageAndGetURL', () => {
    it('should upload image and return URL', async () => {
      // Arrange
      const mockFile: GraphQLUpload = {
        createReadStream: jest.fn(),
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        fieldName: 'test-file',
      };

      // Mock file system functions
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      jest.spyOn(fs, 'mkdirSync').mockImplementation();
      //jest.spyOn(fs, 'createWriteStream').mockReturnValue(jest.fn());

      const mockedUuid = 'mocked-uuid';
      jest.spyOn(global.uuidv4, 'v4').mockReturnValue(mockedUuid);

      const mockId = '1';
      const mockAppUrl = 'http://example.com';

      const result = await resolver.updateUserAvatar(mockId, mockFile);
      expect(result).toEqual(`${mockAppUrl}/${mockedUuid}_test.jpg`);
    });
  });

  describe('tasks', () => {
    it('should return user tasks', async () => {
      const tasks: [GQLTask] = [
        {
          id: 1,
          taskTitle: 'Task Title',
          taskDescription: 'Task Description',
        },
      ];
      const mockUser = {
        id: 1,
        fullname: 'testuser',
        tasks: tasks,
        email: 'testuser@example.com',
        password: 'abcd1234',
        createdAt: '',
        updatedAt: '',
      };

      const result = await resolver.tasks(mockUser);
      expect(result).toEqual(mockUser.tasks);
    });
  });
});
