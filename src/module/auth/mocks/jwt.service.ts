export const token = 'new_token';

export const mockJwtService = {
  signAsync: jest.fn().mockReturnValue(token),
  verify: jest.fn().mockReturnValue(token),
};
