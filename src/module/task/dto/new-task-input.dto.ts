import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class NewTaskInput {
  @Field()
  @MaxLength(200)
  title: string;

  @Field({ nullable: true, defaultValue: '' })
  @IsOptional()
  @MaxLength(500)
  description: string;

  @Field()
  @IsOptional()
  statusId: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  assignUserId: number;
}
