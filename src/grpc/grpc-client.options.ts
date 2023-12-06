import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const getGrpcOptions = (
  configService: ConfigService,
  module: string,
  protoFile: string,
): ClientOptions => {
  return {
    transport: Transport.GRPC,
    options: {
      url: configService.get<string>('APP_GRPC_URL'),
      package: module,
      protoPath: [join(__dirname, `./${protoFile}.proto`)],
    },
  };
};

export default getGrpcOptions;
