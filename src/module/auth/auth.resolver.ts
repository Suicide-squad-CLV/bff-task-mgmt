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
import ForgotPasswordInput from './dto/forgotPassword.dto';
import { SuccessReponse } from './types/normal-response.type';
import UpdatePasswordInput from './dto/updatePassword.dto';

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

  @Mutation(() => SuccessReponse, { name: 'forgotPassword', nullable: true })
  async forgotPassword(@Args('emailInput') emailInput: ForgotPasswordInput) {
    return this.authService.forgotPassword(emailInput);
  }

  @Mutation(() => SuccessReponse, { name: 'updatePassword', nullable: true })
  async updatePassword(
    @Args('passwordInput') passwordInput: UpdatePasswordInput,
  ) {
    return this.authService.updatePassword(passwordInput);
  }

  // @Mutation(() => String)
  // async refreshToken(@Context() context: { req: Request; res: Response }) {
  //   try {
  //     return await this.authService.refreshToken(context.req, context.res);
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
