import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@ArgsType()
export class TaskArgs {
  @Field({ nullable: true, description: 'Task title' })
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @Field(() => Int, { nullable: true, description: 'Assign user Id' })
  @IsOptional()
  @MaxLength(200)
  userId?: number;

  @Field({ nullable: true, description: 'Task status' })
  @IsOptional()
  @MaxLength(200)
  statusId?: string;
}
