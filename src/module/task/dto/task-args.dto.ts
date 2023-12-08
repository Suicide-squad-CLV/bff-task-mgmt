import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@ArgsType()
export class TaskArgs {
  @Field({ nullable: true, description: 'Task title' })
  @IsOptional()
  @MaxLength(200)
  title?: string;
}
