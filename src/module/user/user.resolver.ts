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
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { UPLOAD_PATH } from 'src/common/utils/constants';

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
  async getUsers(
    @Args('keyword', { type: () => String }) keyword: string,
  ): Promise<User[]> {
    return await this.userService.findAll(keyword);
  }

  @Mutation(() => SuccessReponse, { nullable: true, name: 'removeUser' })
  async removeUser(@Args('id') id: string) {
    return this.userService.remove(+id);
  }

  @Mutation(() => User, { name: 'uploadAvatar' })
  async updateUserAvatar(
    @Args('userId', { type: () => String }) userId: string,
    @Args('avatar', { type: () => GraphQLUpload }, FileValidationPipe)
    avatar: GraphQLUpload,
  ) {
    let imageUrl;
    if (avatar) {
      imageUrl = await this.storeImageAndGetURL(avatar);
    }
    return this.userService.updateAvatar(+userId, imageUrl);
  }

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file;
    const dirPath = join(process.cwd(), UPLOAD_PATH);

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(dirPath, uniqueFilename);
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));

    return [process.env.APP_URL, UPLOAD_PATH, uniqueFilename].join('/');
  }

  @ResolveField()
  async tasks(@Parent() user: User) {
    return user.tasks;
    // const { id } = user;
    // return this.taskService.findAll({ assignUserId: id.toString() });
  }
}
