import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GRPCTask } from 'src/grpc/interface/task';
import { User } from 'src/module/user/entity/user.entity';
import { GQLStatus } from './status.entity';

@ObjectType()
export class GQLTask {
  @Field(() => Int)
  id: number;

  @Field()
  taskTitle: string;

  @Field({ nullable: true })
  taskDescription?: string;

  @Field(() => User, { nullable: true })
  assignUser?: User;

  @Field(() => GQLStatus, { nullable: true })
  status?: GQLStatus;

  constructor(task: GRPCTask) {
    // Map GRPCTask to GQLTask
    this.id = task.id;
    this.taskTitle = task.taskTitle;
    this.taskDescription = task.taskDescription;
    this.assignUser = {
      ...task.assignUser,
      refreshToken: '',
      password: '',
      createdAt: '',
      updatedAt: '',
    };
    this.status = new GQLStatus(task.status);
  }
}
