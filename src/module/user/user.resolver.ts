import { User } from 'src/module/user/entity/user.entity';
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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessReponse } from '../auth/types/normal-response.type';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query(() => User, { name: 'getUser' })
  async getDetailUser(@Args('id') id: string): Promise<User> {
    return await this.userService.findOneById(+id);
  }

  @Query(() => [User], { name: 'getAllUsers' })
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Mutation(() => SuccessReponse, { nullable: true, name: 'removeUser' })
  async removeUser(@Args('id') id: string) {
    return this.userService.remove(+id);
  }

  // @Mutation(() => User)
  // async updateUserPassword(
  // @Args('password', { type: () => String, nullable: true }) password?: string,
  // @Args('image', { type: () => GraphQLUpload, nullable: true })
  // image?: GraphQLUpload,
  // ) {
  // let imageUrl;
  // if (image) {
  //   imageUrl = await this.storeImageAndGetURL(image);
  // }
  // return this.userService.updateProfile({ password, image: imageUrl });
  // }

  // private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
  //   const { createReadStream, filename } = await file;
  //   const fileData = await file;
  //   console.log('fileData!', fileData);
  //   const uniqueFilename = `${uuidv4()}_${filename}`;
  //   const imagePath = join(process.cwd(), 'public', uniqueFilename);
  //   const imageUrl = `${process.env.APP_URL}/${uniqueFilename}`;
  //   const readStream = createReadStream();
  //   readStream.pipe(createWriteStream(imagePath));
  //   return imageUrl; // Return the appropriate URL where the file can be accessed
  // }

  @ResolveField()
  async tasks(@Parent() user: User) {
    return user.tasks;
    // const { id } = user;
    // return this.taskService.findAll({ assignUserId: id.toString() });
  }
}
