import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { ErrorResponseDto } from '../dtos/errorResponse.dto';
import { CreateUserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Sign up to the app.' })
  @ApiCreatedResponse({ description: 'User created.' })
  @ApiUnprocessableEntityResponse({
    description: 'The username was already taken.',
    type: ErrorResponseDto,
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
  }
}
