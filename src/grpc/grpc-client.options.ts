import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const getGrpcOptions = (
  configService: ConfigService,
  packageName: string,
  protoFile: string,
): ClientOptions => {
  return {
    transport: Transport.GRPC,
    options: {
      url: configService.get<string>('APP_GRPC_URL'),
      package: packageName,
      protoPath: [join(__dirname, `../grpc/proto/${protoFile}.proto`)],
    },
  };
};

export default getGrpcOptions;
