import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './error.type';
import { User } from '../../user/entity/user.entity';
import { Token } from './token.type';

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Token, { nullable: true })
  token?: Token;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
