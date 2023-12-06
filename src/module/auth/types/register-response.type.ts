import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './error.type';
import { User } from 'src/module/user/entity/user.entity';

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
