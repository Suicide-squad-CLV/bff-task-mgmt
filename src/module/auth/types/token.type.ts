import { ObjectType, Field } from '@nestjs/graphql';

export interface JwtPayload {
  sub: number;
  email: string;
}

@ObjectType()
export class Token {
  @Field()
  token: string;

  @Field()
  type: string;

  @Field()
  expiration: number;
}
