import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, UserRepository],
    }).compile();

    userService = app.get<UserService>(UserService);
    userController = app.get<UserController>(UserController);
  });

  describe('signUp', () => {
    it('should call the userService with the provided object', async () => {
      const userServiceSpy = jest
        .spyOn(userService, 'createUser')
        .mockImplementation();

      const newUserDto = new CreateUserDto();
      newUserDto.username = 'rick';
      newUserDto.password = 'pass';

      await userController.signUp(newUserDto);

      expect(userServiceSpy).toHaveBeenCalledWith(newUserDto);
    });

    it('should throw UnprocessableEntityException', async () => {
      jest.spyOn(userService, 'createUser').mockImplementation(() => {
        throw new UnprocessableEntityException('Username already taken');
      });

      const newUserDto = new CreateUserDto();
      newUserDto.username = 'rick';
      newUserDto.password = 'pass';

      try {
        await userController.signUp(newUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnprocessableEntityException);
      }
    });
  });
});
