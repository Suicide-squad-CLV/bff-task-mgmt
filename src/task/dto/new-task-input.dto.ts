import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';
import { User } from 'src/user/entity/user.entity';

@InputType()
export class NewTaskInput {
  @Field()
  @MaxLength(200)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @Field(() => User)
  @IsOptional()
  user: User;
}
