import { User } from '../../../grpc/interface/user';
import RegisterInput from 'src/module/auth/dto/register.dto';

export const mockInputUser: RegisterInput = {
  email: 'test@example.com',
  fullname: 'Test User',
  password: 'abcd1234',
};

export const mockReturnUser: User = {
  id: 1,
  fullname: mockInputUser.fullname,
  email: mockInputUser.email,
  password: mockInputUser.password,
  avatar: 'test.jpg',
  isDeleted: false,
  refreshToken: null,
  createdAt: '',
  updatedAt: '',
};

export const TOKEN = '';
