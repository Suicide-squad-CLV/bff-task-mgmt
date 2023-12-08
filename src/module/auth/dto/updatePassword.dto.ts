import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength, IsString, MaxLength } from 'class-validator';

@InputType()
class UpdatePasswordInput {
  @Field()
  @IsNotEmpty({ message: 'Token is required.' })
  @IsString({ message: 'Token must be a string.' })
  token: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  @MaxLength(100, { message: 'Password must be maximum 100 characters.' })
  password: string;
}

export default UpdatePasswordInput;
