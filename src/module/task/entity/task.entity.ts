import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/module/user/entity/User.entity';

@ObjectType()
export class Task {
  @Field(() => Int)
  id: number;

  @Field()
  taskTitle: string;

  @Field({ nullable: true })
  taskDescription?: string;

  @Field({ nullable: true, defaultValue: false })
  isDeleted?: boolean;

  @Field(() => User)
  assignUser: User;
}
