import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { TokenDto } from '../dtos/authentication.dto';

jest.mock('@nestjs/jwt');
jest.mock('./user.service');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    userService = app.get<UserService>(UserService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterEach(() => {
    // Reset mocks
    jest.resetAllMocks();
  });

  describe('validateUser', () => {
    const user = new User('rick', bcrypt.hashSync('pass', 10));

    it('successfully validates user', async () => {
      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(user);

      const result = await authService.validateUser('rick', 'pass');

      expect(result).toEqual({ username: 'rick' });
    });

    it('fails to validate user', async () => {
      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(user);

      const result = await authService.validateUser('rick', 'wrong_pass');

      expect(result).toBeNull();
    });

    it('fails to find user', async () => {
      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(null);

      const result = await authService.validateUser('rick', 'wrong_pass');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('returns TokenDto', () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = authService.login({ username: 'rick', id: 1 });

      expect(jwtService.sign).toHaveBeenLastCalledWith({
        username: 'rick',
        sub: 1,
      });
      expect(result).toEqual(new TokenDto('token'));
    });
  });
});
