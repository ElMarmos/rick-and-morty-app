import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FavoriteCharacter } from './favoriteCharacter.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  readonly id: number;

  @Index('IDX_USERNAME', { unique: true })
  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @OneToMany(
    () => FavoriteCharacter,
    (favoriteCharacter) => favoriteCharacter.user,
  )
  favoriteCharacters: FavoriteCharacter[];

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
