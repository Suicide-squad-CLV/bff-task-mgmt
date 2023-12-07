import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@ArgsType()
export class TaskArgs {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @Field({ nullable: true, description: 'Assigned User ID' })
  @IsOptional()
  @MaxLength(50)
  assignUserId?: string;

  @Field({ nullable: true, description: 'Assigned User Name' })
  @IsOptional()
  @MaxLength(50)
  assignUserName?: string;
}
