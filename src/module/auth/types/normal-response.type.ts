import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './error.type';

@ObjectType()
export class SuccessReponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
