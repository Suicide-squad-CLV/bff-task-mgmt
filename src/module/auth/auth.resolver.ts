import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { UseFilters } from '@nestjs/common';
import { RegisterResponse } from './types/register-response.type';
import RegisterDto from './dto/register.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
  ): Promise<RegisterResponse> {
    try {
      const res = await this.authService.register(registerDto);
      console.log('res', res);
    } catch (error) {
      return {
        error: {
          message: error.message,
          code: 'SOME_ERROR_CODE',
        },
      };
    }
  }

  // @Mutation(() => LoginResponse)
  // async login(
  //   @Args('loginInput') loginDto: LoginDto,
  //   @Context() context: { res: Response },
  // ) {
  //   return this.authService.login(loginDto, context.res);
  // }
}
