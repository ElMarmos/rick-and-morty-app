import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/user.dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

jest.mock('../repositories/user.repository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    // Reset mocks
    jest.resetAllMocks();
  });

  const user = new User('rick', bcrypt.hashSync('pass', 10));

  describe('getUserByUsername', () => {
    it('returns a user', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(user);

      const result = await userService.getUserByUsername('rick');

      expect(userRepository.findByUsername).toBeCalledWith('rick');
      expect(result).toEqual(user);
    });

    it('returns null', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);

      const result = await userService.getUserByUsername('rick');

      expect(userRepository.findByUsername).toBeCalledWith('rick');
      expect(result).toEqual(null);
    });
  });

  describe('createUser', () => {
    const createUserDto = new CreateUserDto();
    createUserDto.username = 'rick';
    createUserDto.password = 'pass';

    it('creates a  User', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);

      await userService.createUser(createUserDto);

      expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('throws UnprocessableEntityException when user already exist', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(user);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('finds a  User', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findUserById(1);

      expect(userRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });

    it('throws NotFoundException when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.findUserById(1)).rejects.toThrow(
        NotFoundException,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith(1);
    });
  });
});
