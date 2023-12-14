import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @MaxLength(200)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(500)
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  statusId: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  assignUserId: number;
}
