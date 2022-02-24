import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'favorite_characters' })
export class FavoriteCharacter {
  @PrimaryGeneratedColumn({ unsigned: true })
  readonly id: number;

  @Column({ name: 'number' })
  number: number;

  @Column({ name: 'page' })
  page: number;

  @ManyToOne(() => User, (user) => user.favoriteCharacters)
  user: User;

  constructor(number: number, page: number) {
    this.number = number;
    this.page = page;
  }
}
