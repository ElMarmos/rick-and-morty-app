import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Finds a user given it's username.
   * @param username user's username to find.
   * @returns User object if found, null otherwise.
   */
  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  /**
   * Creates a new user.
   * @param param0 CreateUserDto object with the user's data.
   */
  async createUser({ username, password }: CreateUserDto): Promise<void> {
    const userExists = await this.userRepository.findByUsername(username);
    if (userExists) {
      throw new UnprocessableEntityException('Username already taken');
    }

    await this.userRepository.save(
      new User(username, bcrypt.hashSync(password, 10)),
    );
  }

  /**
   * Finds a user by id.
   * @param id Id of the user to find.
   * @returns User object if found, null otherwise.
   */
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
