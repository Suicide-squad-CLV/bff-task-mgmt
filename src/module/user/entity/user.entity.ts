import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GQLTask } from 'src/module/task/entity/task.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  fullname: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true, defaultValue: false })
  hasChangePassword?: boolean;

  @Field({ nullable: true, defaultValue: false })
  isDeleted?: boolean;

  @Field({ nullable: true })
  createdAt: string;

  @Field({ nullable: true })
  updatedAt: string;

  @Field(() => [GQLTask])
  tasks?: [GQLTask];
}
