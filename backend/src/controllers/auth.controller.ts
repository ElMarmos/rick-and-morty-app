import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthenticationDto, TokenDto } from 'src/dtos/authentication.dto';
import { ErrorResponseDto } from 'src/dtos/errorResponse.dto';
import { LocalAuthGuard } from 'src/guards/localAuth.guard';
import { AuthService } from 'src/services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login into the app.' })
  @ApiBody({ type: AuthenticationDto })
  @ApiOkResponse({ description: 'Successful authentication.', type: TokenDto })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password.',
    type: ErrorResponseDto,
  })
  login(@Request() { user }) {
    console.log(user);
    return this.authService.login(user);
  }
}
