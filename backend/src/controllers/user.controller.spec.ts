import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

jest.mock('../services/user.service');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = app.get<UserService>(UserService);
    userController = app.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signUp', () => {
    // Data
    const newUserDto = new CreateUserDto();
    newUserDto.username = 'rick';
    newUserDto.password = 'pass';

    it('should call the userService with the provided object', async () => {
      await userController.signUp(newUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(newUserDto);
    });

    it('should throw UnprocessableEntityException', async () => {
      jest.spyOn(userService, 'createUser').mockImplementation(() => {
        throw new UnprocessableEntityException();
      });

      await expect(userController.signUp(newUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(userService.createUser).toHaveBeenLastCalledWith(newUserDto);
    });
  });
});
