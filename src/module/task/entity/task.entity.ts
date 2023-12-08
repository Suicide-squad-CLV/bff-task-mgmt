import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Task as TaskGRPC } from 'src/grpc/interface/task';
import { User } from 'src/module/user/entity/user.entity';

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

  @Field(() => User, { nullable: true })
  assignUser?: User;

  constructor(task: TaskGRPC) {
    this.id = task.id;
    this.taskTitle = task.taskTitle;
    this.taskDescription = task.taskDescription;
    this.isDeleted = task.isDeleted;
  }
}
