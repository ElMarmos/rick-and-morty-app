import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { ErrorResponseDto } from 'src/dtos/errorResponse.dto';
import { CreateUserDto } from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.service';

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
    return this.userService.createUser(createUserDto);
  }
}
