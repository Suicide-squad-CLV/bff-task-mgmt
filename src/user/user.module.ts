import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { DateScalar } from 'src/graphql/scalar/date.scalar';

@Module({
  providers: [UserResolver, DateScalar],
})
export class UserModule {}
