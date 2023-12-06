import { User } from 'src/module/user/entity/user.entity';
// import { NotFoundException } from '@nestjs/common';
import {
  Query,
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserArgs } from './dto/user-args.dto';
import { NewUserInput } from './dto/new-user-input.dto';
import { TaskService } from 'src/module/task/task.service';
import { UserService } from './user.service';
// import { firstValueFrom } from 'rxjs';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    // const user = await firstValueFrom(this.userService.findOneById(id));
    // if (!user) {
    //   throw new NotFoundException(id);
    // }
    // return user;
    console.log(id);
    return new User();
  }

  @Query(() => [User])
  async users(@Args() userArgs: UserArgs): Promise<User[]> {
    // return firstValueFrom(this.userService.findAll(userArgs));
    console.log(userArgs);
    return [];
  }

  @Mutation(() => User)
  async addUser(@Args('newUserData') newUserData: NewUserInput): Promise<User> {
    // const user = await firstValueFrom(this.userService.create(newUserData));
    // return user;
    console.log(newUserData);
    return new User();
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }

  @ResolveField()
  async tasks(@Parent() user: User) {
    const { id } = user;
    return this.taskService.findAll({ assignUserId: id });
  }
}
