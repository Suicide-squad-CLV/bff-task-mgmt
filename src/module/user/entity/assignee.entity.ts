import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GQLTask } from 'src/module/task/entity/task.entity';

@ObjectType()
export class Assignee {
  @Field(() => ID, {
    nullable: true,
  })
  id?: number;

  @Field({ nullable: true })
  fullname?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

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
