import { CACHE_MANAGER, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RamService } from './ram.service';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from './user.service';
import { FavoriteCharacterRepository } from '../repositories/favoriteCharacter.repository';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { PaginationDto } from '../dtos/pagination.dto';
import { CharacterDto } from '../dtos/character.dto';
import { User } from '../entities/user.entity';
import { FavoriteCharacter } from '../entities/favoriteCharacter.entity';

jest.mock('cache-manager');
jest.mock('./user.service');
jest.mock('../repositories/favoriteCharacter.repository');

describe('RamService', () => {
  let userService: UserService;
  let ramService: RamService;
  let cacheManager: Cache;
  let favoriteCharacterRepository: FavoriteCharacterRepository;

  // Test data
  const apiResponse = {
    info: {
      count: 3,
      pages: 2,
      next: 'https://rickandmortyapi.com/api/character/?page=2',
      prev: null,
    },
    results: [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: {
          name: 'Earth (C-137)',
          url: 'https://rickandmortyapi.com/api/location/1',
        },
        location: {
          name: 'Citadel of Ricks',
          url: 'https://rickandmortyapi.com/api/location/3',
        },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2',
          'https://rickandmortyapi.com/api/episode/3',
        ],
        url: 'https://rickandmortyapi.com/api/character/1',
        created: '2017-11-04T18:48:46.250Z',
      },
      {
        id: 2,
        name: 'Morty Smith',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'unknown', url: '' },
        location: {
          name: 'Citadel of Ricks',
          url: 'https://rickandmortyapi.com/api/location/3',
        },
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2',
        ],
        url: 'https://rickandmortyapi.com/api/character/2',
        created: '2017-11-04T18:50:21.651Z',
      },
    ],
  };

  // Test data
  const char1 = new CharacterDto();
  char1.id = 1;
  char1.name = 'Rick Sanchez';
  char1.status = 'Alive';
  char1.species = 'Human';
  char1.type = '';
  char1.gender = 'Male';
  char1.origin = 'Earth (C-137)';
  char1.location = 'Citadel of Ricks';
  char1.image = 'https://rickandmortyapi.com/api/character/avatar/1.jpeg';
  char1.episodes = [1, 2, 3];

  const char2 = new CharacterDto();
  char2.id = 2;
  char2.name = 'Morty Smith';
  char2.status = 'Alive';
  char2.species = 'Human';
  char2.type = '';
  char2.gender = 'Male';
  char2.origin = 'unknown';
  char2.location = 'Citadel of Ricks';
  char2.image = 'https://rickandmortyapi.com/api/character/avatar/2.jpeg';
  char2.episodes = [1, 2];

  const char3 = new CharacterDto();
  char3.id = 3;
  char3.name = 'Summer Smith';
  char3.status = 'Alive';
  char3.species = 'Human';
  char3.type = '';
  char3.gender = 'Female';
  char3.origin = 'Earth (Replacement Dimension)';
  char3.location = 'Earth (Replacement Dimension)';
  char3.image = 'https://rickandmortyapi.com/api/character/avatar/3.jpeg';
  char3.episodes = [4, 5];

  const paginationDto1 = new PaginationDto();
  paginationDto1.count = 3;
  paginationDto1.pages = 2;
  paginationDto1.next = 2;
  paginationDto1.prev = null;
  paginationDto1.results = [char1, char2];

  const paginationDto2 = new PaginationDto();
  paginationDto2.count = 3;
  paginationDto2.pages = 2;
  paginationDto2.next = null;
  paginationDto2.prev = 1;
  paginationDto2.results = [char3];

  const user = new User('user', 'pass');

  const favoriteChar1: FavoriteCharacter = new FavoriteCharacter(1, 1, user);
  const favoriteChar2: FavoriteCharacter = new FavoriteCharacter(3, 2, user);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        RamService,
        FavoriteCharacterRepository,
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn().mockImplementation(() => ({
            get: jest.fn(),
            set: jest.fn(),
          })),
        },
      ],
    }).compile();

    ramService = app.get<RamService>(RamService);
    cacheManager = app.get(CACHE_MANAGER);
    userService = app.get<UserService>(UserService);
    favoriteCharacterRepository = app.get<FavoriteCharacterRepository>(
      FavoriteCharacterRepository,
    );
  });

  afterEach(() => {
    // Reset mocks
    jest.resetAllMocks();

    // Reset characters favorite status
    char1.isFavorite = undefined;
    char2.isFavorite = undefined;
    char3.isFavorite = undefined;
  });

  describe('getCharacters', () => {
    it('should return a PaginationDto from the API', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(axios, 'get').mockResolvedValue({ data: apiResponse });
      jest
        .spyOn(favoriteCharacterRepository, 'findAllByUserAndPage')
        .mockResolvedValue([favoriteChar1]);

      char1.isFavorite = true;
      char2.isFavorite = false;

      const resPaginationDto = await ramService.getCharacters(1, 1);

      expect(userService.findUserById).toHaveBeenCalledWith(1);
      expect(cacheManager.get).toHaveBeenCalledWith(`page${1}`);
      expect(axios.get).toHaveBeenCalledWith('/character', {
        params: { page: 1 },
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        `page${1}`,
        expect.any(String),
      );
      expect(
        favoriteCharacterRepository.findAllByUserAndPage,
      ).toHaveBeenCalledWith(user, 1);
      expect(resPaginationDto).toEqual(paginationDto1);
    });

    it('should return a PaginationDto from cache', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(JSON.stringify(paginationDto2));
      jest
        .spyOn(favoriteCharacterRepository, 'findAllByUserAndPage')
        .mockResolvedValue([favoriteChar2]);

      char3.isFavorite = true;

      const resPaginationDto = await ramService.getCharacters(1, 2);

      expect(userService.findUserById).toHaveBeenCalledWith(1);
      expect(cacheManager.get).toHaveBeenCalledWith(`page${2}`);
      expect(axios.get).toHaveBeenCalledTimes(0);
      expect(
        favoriteCharacterRepository.findAllByUserAndPage,
      ).toHaveBeenCalledWith(user, 2);
      expect(resPaginationDto).toEqual(paginationDto2);
    });

    it('should return a PaginationDto with items without favorites', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(JSON.stringify(paginationDto1));
      jest
        .spyOn(favoriteCharacterRepository, 'findAllByUserAndPage')
        .mockResolvedValue([]);

      char1.isFavorite = false;
      char2.isFavorite = false;

      const resPaginationDto = await ramService.getCharacters(1, 1);

      expect(userService.findUserById).toHaveBeenCalledWith(1);
      expect(cacheManager.get).toHaveBeenCalledWith(`page${1}`);
      expect(axios.get).toHaveBeenCalledTimes(0);
      expect(
        favoriteCharacterRepository.findAllByUserAndPage,
      ).toHaveBeenCalledWith(user, 1);
      expect(resPaginationDto).toEqual(paginationDto1);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userService, 'findUserById').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(ramService.getCharacters(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if API request fails', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(axios, 'get').mockRejectedValue({});

      await expect(ramService.getCharacters(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleCharacterFromFavorites', () => {
    it('should add a character to favorites', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest
        .spyOn(favoriteCharacterRepository, 'findByUserAndCharacterId')
        .mockResolvedValue(null);

      await ramService.toggleCharacterFromFavorites(1, 1, 1);

      expect(
        favoriteCharacterRepository.findByUserAndCharacterId,
      ).toHaveBeenCalledWith(user, 1);
      expect(favoriteCharacterRepository.save).toHaveBeenCalledWith(
        favoriteChar1,
      );
    });

    it('should remove a character from favorites', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest
        .spyOn(favoriteCharacterRepository, 'findByUserAndCharacterId')
        .mockResolvedValue(favoriteChar2);

      await ramService.toggleCharacterFromFavorites(1, 3, 2);

      expect(
        favoriteCharacterRepository.findByUserAndCharacterId,
      ).toHaveBeenCalledWith(user, 3);
      expect(favoriteCharacterRepository.delete).toHaveBeenCalledWith(
        favoriteChar2.id,
      );
      expect(favoriteCharacterRepository.save).not.toHaveBeenCalled();
    });
  });
});
