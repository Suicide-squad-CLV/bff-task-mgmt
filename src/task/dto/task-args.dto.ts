import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@ArgsType()
export class TaskArgs {
  @Field()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @Field({ description: 'Assigned User ID' })
  @IsOptional()
  @MaxLength(50)
  assignUserId?: string;
}
