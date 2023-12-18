import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GRPCTask } from 'src/grpc/interface/task';
import { GQLStatus } from './status.entity';
import { Assignee } from 'src/module/user/entity/assignee.entity';

@ObjectType()
export class GQLTask {
  @Field(() => Int)
  id: number;

  @Field()
  taskTitle: string;

  @Field({ nullable: true })
  taskDescription?: string;

  @Field(() => Assignee, { nullable: true })
  assignUser?: Assignee;

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
