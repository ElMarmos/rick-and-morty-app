import {
  CacheModule,
  UnprocessableEntityException,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RamService } from './ram.service';
import { CreateUserDto } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from './user.service';
import { RamController } from '../controllers/ram.controller';
import { FavoriteCharacterRepository } from '../repositories/favoriteCharacter.repository';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { PaginationDto } from '../dtos/pagination.dto';
import { CharacterDto } from '../dtos/character.dto';
import { PageParamDto } from '../dtos/queryParams.dto';
import { User } from '../entities/user.entity';
import { FavoriteCharacter } from '../entities/favoriteCharacter.entity';

describe('RamController', () => {
  let ramController: RamController;
  let userService: UserService;
  let ramService: RamService;
  let cacheManager: Cache;
  let favoriteCharacterRepository: FavoriteCharacterRepository;

  // Test data
  const apiResponse1 = {
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

  const apiResponse2 = {
    info: {
      count: 3,
      pages: 2,
      next: null,
      prev: 'https://rickandmortyapi.com/api/character/?page=1',
    },
    results: [
      {
        id: 3,
        name: 'Summer Smith',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Female',
        origin: {
          name: 'Earth (Replacement Dimension)',
          url: 'https://rickandmortyapi.com/api/location/20',
        },
        location: {
          name: 'Earth (Replacement Dimension)',
          url: 'https://rickandmortyapi.com/api/location/20',
        },
        image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
        episode: [
          'https://rickandmortyapi.com/api/episode/4',
          'https://rickandmortyapi.com/api/episode/5',
        ],
        url: 'https://rickandmortyapi.com/api/character/3',
        created: '2017-11-04T19:09:56.428Z',
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
  char1.isFavorite = true;

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
  char2.isFavorite = false;

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
  char3.isFavorite = true;

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
      controllers: [RamController],
      providers: [
        UserService,
        UserRepository,
        RamService,
        FavoriteCharacterRepository,
      ],
      imports: [CacheModule.register()],
    }).compile();

    userService = app.get<UserService>(UserService);
    ramService = app.get<RamService>(RamService);
    ramController = app.get<RamController>(RamController);
    favoriteCharacterRepository = app.get<FavoriteCharacterRepository>(
      FavoriteCharacterRepository,
    );
    cacheManager = app.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getCharacters', () => {
    it('should return a PaginationDto from the server', async () => {
      const userServiceSpy = jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValue(user);
      const cacheSpy = jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      const axiosSpy = jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: apiResponse1 });
      const favCharRepoSpy = jest
        .spyOn(favoriteCharacterRepository, 'findAllByUserAndPage')
        .mockResolvedValue([favoriteChar1]);

      const resPaginationDto = await ramController.getCharacters(
        { user: { userId: 1 } },
        { page: 1 },
      );

      expect(userServiceSpy).toHaveBeenCalledWith(1);
      expect(cacheSpy).toHaveBeenCalledWith(`page${1}`);
      expect(axiosSpy).toHaveBeenCalledWith('/character', {
        params: { page: 1 },
      });
      expect(favCharRepoSpy).toHaveBeenCalledWith(user, 1);
      expect(resPaginationDto).toEqual(paginationDto1);
    });

    it('should return a PaginationDto from cache', async () => {
      const userServiceSpy = jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValue(user);
      const cacheSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(JSON.stringify(paginationDto2));
      const axiosSpy = jest.spyOn(axios, 'get');
      const favCharRepoSpy = jest
        .spyOn(favoriteCharacterRepository, 'findAllByUserAndPage')
        .mockResolvedValue([favoriteChar2]);

      const resPaginationDto = await ramController.getCharacters(
        { user: { userId: 1 } },
        { page: 2 },
      );

      expect(userServiceSpy).toHaveBeenCalledWith(1);
      expect(cacheSpy).toHaveBeenCalledWith(`page${2}`);
      expect(axiosSpy).toHaveBeenCalledTimes(0);
      expect(favCharRepoSpy).toHaveBeenCalledWith(user, 2);
      expect(resPaginationDto).toEqual(paginationDto2);
    });

    it('should return a PaginationDto from cache', async () => {
      const userServiceSpy = jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValue(user);
      const cacheSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(JSON.stringify(paginationDto2));
      const axiosSpy = jest.spyOn(axios, 'get');
      const favCharRepoSpy = jest
        .spyOn(favoriteCharacterRepository, 'findAllByUserAndPage')
        .mockResolvedValue([favoriteChar2]);

      const resPaginationDto = await ramController.getCharacters(
        { user: { userId: 1 } },
        { page: 2 },
      );

      expect(userServiceSpy).toHaveBeenCalledWith(1);
      expect(cacheSpy).toHaveBeenCalledWith(`page${2}`);
      expect(axiosSpy).toHaveBeenCalledTimes(0);
      expect(favCharRepoSpy).toHaveBeenCalledWith(user, 2);
      expect(resPaginationDto).toEqual(paginationDto2);
    });
  });
});
