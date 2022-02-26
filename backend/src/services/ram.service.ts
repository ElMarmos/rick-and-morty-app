import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { CharacterDto } from '../dtos/character.dto';
import { PaginationDto } from '../dtos/pagination.dto';
import { Cache } from 'cache-manager';
import { UserService } from './user.service';
import { FavoriteCharacterRepository } from '../repositories/favoriteCharacter.repository';
import { FavoriteCharacter } from '../entities/favoriteCharacter.entity';

const RAM_API_BASE_URL = 'https://rickandmortyapi.com/api';

@Injectable()
export class RamService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
    private readonly favoriteCharacterRepository: FavoriteCharacterRepository,
  ) {
    axios.defaults.baseURL = RAM_API_BASE_URL;
  }

  /**
   * Gets a the list of characters of the provided page from the Rick and Morty API.
   * @param userId Id of the authenticated user.
   * @param page Page number to request.
   * @returns PaginationDto object with the result of the request, NotFoundException if the page doesn't exists.
   */
  async getCharacters(userId: number, page = 1): Promise<PaginationDto> {
    const user = await this.userService.findUserById(userId);

    let paginationDto: PaginationDto;

    const cachedPage = (await this.cacheManager.get(`page${page}`)) as string;
    if (cachedPage) {
      paginationDto = JSON.parse(cachedPage) as PaginationDto;
    } else {
      try {
        const {
          data: { info, results },
        } = await axios.get('/character', {
          params: {
            page,
          },
        });

        paginationDto = new PaginationDto();
        paginationDto.count = info.count;
        paginationDto.pages = info.pages;
        paginationDto.next = info.next && Number(info.next.split('=')[1]);
        paginationDto.prev = info.prev && Number(info.prev.split('=')[1]);
        paginationDto.results = results.map((result: any) => {
          return plainToInstance(CharacterDto, result, {
            excludeExtraneousValues: true,
          });
        });

        this.cacheManager.set(`page${page}`, JSON.stringify(paginationDto));
      } catch (e) {
        throw new NotFoundException('Page not found');
      }
    }

    const userFavorites =
      await this.favoriteCharacterRepository.findAllByUserAndPage(user, page);

    const favoritesMap: Record<number, boolean> = {};

    userFavorites.forEach((fc) => {
      favoritesMap[fc.characterId] = true;
    });

    paginationDto.results.forEach((character) => {
      character.isFavorite = favoritesMap[character.id] || false;
    });

    return paginationDto;
  }

  /**
   * Adds or removes a character from the list of favorites.
   * @param userId Id of the authenticated user.
   * @param characterId Id of the character.
   * @param page Page to which the character belongs.
   */
  async toggleCharacterFromFavorites(
    userId: number,
    characterId: number,
    page: number,
  ): Promise<void> {
    const user = await this.userService.findUserById(userId);
    let favoriteCharacter: FavoriteCharacter =
      await this.favoriteCharacterRepository.findByUserAndCharacterId(
        user,
        characterId,
      );

    if (favoriteCharacter) {
      await this.favoriteCharacterRepository.delete(favoriteCharacter.id);
      return;
    }

    favoriteCharacter = new FavoriteCharacter(characterId, page, user);

    await this.favoriteCharacterRepository.save(favoriteCharacter);
  }
}
