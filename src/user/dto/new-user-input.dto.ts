import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';
import { randomUUID } from 'crypto';

@InputType()
export class NewUserInput {
  @Field({ defaultValue: randomUUID() })
  id: string;

  @Field()
  @MaxLength(200)
  fullName: string;

  @Field()
  @MaxLength(200)
  email: string;

  @Field()
  @MaxLength(200)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(4000)
  avatar?: string;
}
