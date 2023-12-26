const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'TOKEN_EXPIRED':
        return 3600;
      case 'ACCESS_TOKEN_SECRET':
        return 'secret';
      default:
        return '40000';
    }
  },
};

export default mockedConfigService;
