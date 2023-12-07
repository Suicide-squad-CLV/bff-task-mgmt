import { Task } from './entity/task.entity';
import { NotFoundException } from '@nestjs/common';
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

@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query(() => Task)
  async task(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    const task = await this.taskService.findOneById(id);
    if (!task) {
      throw new NotFoundException(id);
    }
    return task;
  }

  @Query(() => [Task])
  async tasks(@Args() taskArgs: TaskArgs): Promise<Task[]> {
    return this.taskService.findAll(taskArgs);
  }

  @Mutation(() => Task)
  async addTask(@Args('newTaskData') newTaskData: NewTaskInput): Promise<Task> {
    const task = await this.taskService.create(newTaskData);
    return task;
  }

  @Mutation(() => Boolean)
  async removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.taskService.remove(id);
  }

  @ResolveField()
  async assignUser(@Parent() task: Task): Promise<User> {
    const { assignUser } = task;
    console.log('assignUser', assignUser);
    // return this.userService.findOneById(assignUser.id);
    return null;
  }
}
