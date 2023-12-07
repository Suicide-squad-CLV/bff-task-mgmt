import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GraphQLErrorFilter } from 'src/common/filters/custom-exception.filter';
import { UseFilters, UseGuards } from '@nestjs/common';
import { RegisterResponse } from './types/register-response.type';
import { LoginResponse } from './types/login-response.type';
import RegisterInput from './dto/register.dto';
import { User } from '../user/entity/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import LoginInput from './dto/login.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => RegisterResponse, { name: 'register' })
  async register(
    @Args('registerInput') registerDto: RegisterInput,
  ): Promise<RegisterResponse> {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      return {
        error: {
          message: error.message,
          code: 'SOME_ERROR_CODE',
        },
      };
    }
  }

  @Mutation(() => LoginResponse, { name: 'login' })
  @UseGuards(GqlAuthGuard)
  async login(@Args('loginInput') loginInput: LoginInput, @Context() context) {
    return this.authService.login(context.user);
  }

  @Query(() => User, { name: 'profile' })
  @UseGuards(JwtAuthGuard)
  async profile(@Context() context): Promise<User> {
    return await this.authService.profile(context.req.user);
  }
}
