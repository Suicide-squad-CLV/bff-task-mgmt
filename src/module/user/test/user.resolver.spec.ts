import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '../user.resolver';
import { UserService } from '../user.service';
import { Response, User } from 'src/grpc/interface/user';
import { mockReturnUser } from '../stubs/user.stub';

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
});
