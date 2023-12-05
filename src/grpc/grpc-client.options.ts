import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    // TODO: Define gRPC client options based on requirements
    // Example Options
    url: '',
    package: 'hero', // ["hero", "hero2"]
    protoPath: join(__dirname, './hero/hero.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
  },
};
