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
import { TaskService } from 'src/module/task/task.service';
import { UserService } from './user.service';
import UserDataInput from './dto/user-input.dto';
// import { firstValueFrom } from 'rxjs';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query(() => User, { name: 'getUser' })
  async user(@Args('id') id: string): Promise<User> {
    // const user = await firstValueFrom(this.userService.findOneById(id));
    // if (!user) {
    //   throw new NotFoundException(id);
    // }
    // return user;
    console.log(id);
    return new User();
  }

  @Query(() => [User], { name: 'getAllUsers' })
  async users(@Args() userArgs: UserDataInput): Promise<User[]> {
    // return firstValueFrom(this.userService.findAll(userArgs));
    console.log(userArgs);
    return [];
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }

  @ResolveField()
  async tasks(@Parent() user: User) {
    const { id } = user;
    return this.taskService.findAll({ assignUserId: id.toString() });
  }
}
