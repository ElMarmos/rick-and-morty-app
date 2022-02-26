import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';
import { TokenDto } from '../dtos/authentication.dto';

jest.mock('../services/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    authController = app.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('login', () => {
    // Data
    const input = { user: { username: 'rick', id: 1 } };

    it('should return a TokenDto', () => {
      const token = new TokenDto('abc');
      jest.spyOn(authService, 'login').mockReturnValue(token);

      const response = authController.login(input);

      expect(authService.login).toHaveBeenCalledWith(input.user);
      expect(response).toEqual(token);
    });
  });
});
