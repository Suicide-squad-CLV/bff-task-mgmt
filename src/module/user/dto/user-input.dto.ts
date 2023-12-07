import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@ArgsType()
class UserDataInput {
  @Field()
  @IsOptional()
  @MaxLength(200)
  fullName?: string;

  @Field()
  @IsOptional()
  @MaxLength(200)
  email?: string;
}

export default UserDataInput;
