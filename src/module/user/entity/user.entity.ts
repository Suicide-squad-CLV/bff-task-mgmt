import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Task } from 'src/module/task/entity/task.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

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

  @Field(() => Date, { defaultValue: new Date() })
  createDate: Date;

  @Field(() => Date, { defaultValue: new Date() })
  updateDate: Date;

  @Field(() => [Task])
  tasks: [Task];
}
