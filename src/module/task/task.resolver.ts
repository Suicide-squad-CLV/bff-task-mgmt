import { GQLTask } from './entity/task.entity';
import { GQLStatus } from './entity/status.entity';
import { NotFoundException, UseGuards } from '@nestjs/common';
import {
  Int,
  Query,
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { NewTaskInput } from './dto/new-task-input.dto';
import { TaskArgs } from './dto/task-args.dto';
import { TaskService } from './task.service';
import { UserService } from 'src/module/user/user.service';
import { User } from 'src/module/user/entity/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => GQLTask)
@UseGuards(JwtAuthGuard)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [GQLStatus])
  async statusList(): Promise<GQLStatus[]> {
    const statusList = await this.taskService.findAllStatus();
    if (!statusList) {
      throw new NotFoundException();
    }
    return statusList;
  }

  @Query(() => GQLTask)
  async task(@Args('id', { type: () => Int }) id: number): Promise<GQLTask> {
    const task = await this.taskService.findOneById(id);
    if (!task) {
      throw new NotFoundException(id);
    }
    return task;
  }

  @Query(() => [GQLTask])
  async tasks(@Args() taskArgs: TaskArgs): Promise<GQLTask[]> {
    return this.taskService.findAll(taskArgs);
  }

  @Mutation(() => GQLTask)
  async addTask(
    @Args('newTaskData') newTaskData: NewTaskInput,
  ): Promise<GQLTask> {
    const task = await this.taskService.create(newTaskData);
    return task;
  }

  @Mutation(() => Boolean)
  async removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.taskService.remove(id);
  }

  @ResolveField()
  async assignUser(@Parent() task: GQLTask): Promise<User> {
    // const { assignUser } = task;
    // console.log('assignUser', assignUser);
    // return this.userService.findOneById(assignUser.id);
    return task.assignUser;
  }

  @ResolveField()
  async status(@Parent() task: GQLTask): Promise<GQLStatus> {
    // Get Status infor from task
    return task.status;
  }
}
