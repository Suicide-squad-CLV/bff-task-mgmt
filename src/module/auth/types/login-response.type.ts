import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './error.type';
import { User } from 'src/module/user/entity/user.entity';
import { Token } from './token.type';

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field(() => Token)
  token: Token;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
