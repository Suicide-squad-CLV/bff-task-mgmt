import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class NewTaskInput {
  @Field()
  @MaxLength(200)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @Field()
  @IsOptional()
  assignUserId: string;
}
