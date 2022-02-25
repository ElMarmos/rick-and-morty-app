import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../dtos/authentication.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates if a user with the given username exists
   * and if the password matches.
   * @param username Username to check.
   * @param password Password to compare.
   * @returns User object if found, null otherwise.
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.getUserByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  /**
   * Logs a user into the app and returns a token for future requests.
   * @param param0 User's username and id.
   * @returns TokenDto object with the generated JWT.
   */
  login({ username, id }): TokenDto {
    return new TokenDto(this.jwtService.sign({ username, sub: id }));
  }
}
