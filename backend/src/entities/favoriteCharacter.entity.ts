import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'favorite_characters' })
@Index('IDX_USER_CHARACT_NUMBER', ['user', 'characterId'], { unique: true })
export class FavoriteCharacter {
  @PrimaryGeneratedColumn({ unsigned: true })
  readonly id: number;

  @Column({ name: 'character_id' })
  characterId: number;

  @Column({ name: 'page' })
  page: number;

  @ManyToOne(() => User, (user) => user.favoriteCharacters)
  user: User;

  constructor(characterId: number, page: number, user: User) {
    this.characterId = characterId;
    this.page = page;
    this.user = user;
  }
}
