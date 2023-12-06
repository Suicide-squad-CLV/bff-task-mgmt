import { Task } from './entity/task.entity';
// import { NotFoundException } from '@nestjs/common';
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
// import { firstValueFrom } from 'rxjs';
import { User } from 'src/module/user/entity/user.entity';

@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query(() => Task)
  async task(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    // const task = await firstValueFrom(this.taskService.findOneById(id));
    // if (!task) {
    //   throw new NotFoundException(id);
    // }
    // return task;
    console.log(id);
    return new Task();
  }

  @Query(() => [Task])
  async tasks(@Args() taskArgs: TaskArgs): Promise<Task[]> {
    // return firstValueFrom(this.taskService.findAll(taskArgs));
    console.log(taskArgs);
    return [];
  }

  @Mutation(() => Task)
  async addTask(@Args('newTaskData') newTaskData: NewTaskInput): Promise<Task> {
    // const task = await firstValueFrom(this.taskService.create(newTaskData));
    // return task;
    console.log(newTaskData);
    return new Task();
  }

  @Mutation(() => Boolean)
  async removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.taskService.remove(id);
  }

  @ResolveField()
  async assignUser(@Parent() task: Task): Promise<User> {
    // const { assignUser } = task;
    // return firstValueFrom(this.userService.findOneById(assignUser.id));
    console.log(task);
    return new User();
  }
}
