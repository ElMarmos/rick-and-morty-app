import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { FavoriteCharacter } from '../entities/favoriteCharacter.entity';

@EntityRepository(FavoriteCharacter)
export class FavoriteCharacterRepository extends Repository<FavoriteCharacter> {
  findAllByUserAndPage(user: User, page: number) {
    return this.find({ user, page });
  }

  findByUserAndCharacterId(user: User, characterId: number) {
    return this.findOne({ user, characterId });
  }
}
