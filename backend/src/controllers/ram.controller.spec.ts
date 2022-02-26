import { Test, TestingModule } from '@nestjs/testing';
import { RamService } from '../services/ram.service';
import { RamController } from './ram.controller';
import { PaginationDto } from '../dtos/pagination.dto';
import { AddCharacterToFavoriteDto, CharacterDto } from '../dtos/character.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../services/ram.service');

describe('RamController', () => {
  let ramController: RamController;
  let ramService: RamService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RamController],
      providers: [RamService],
    }).compile();

    ramService = app.get<RamService>(RamService);
    ramController = app.get<RamController>(RamController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Data
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

  const paginationDto1 = new PaginationDto();
  paginationDto1.count = 3;
  paginationDto1.pages = 2;
  paginationDto1.next = 2;
  paginationDto1.prev = null;
  paginationDto1.results = [char1, char2];

  const auth = { user: { userId: 1 } };

  describe('getCharacters', () => {
    const queryParams = { page: 1 };

    it('should return a PaginationDto', async () => {
      jest.spyOn(ramService, 'getCharacters').mockResolvedValue(paginationDto1);

      const response = await ramController.getCharacters(auth, queryParams);

      expect(ramService.getCharacters).toHaveBeenCalledWith(
        auth.user.userId,
        queryParams.page,
      );

      expect(response).toEqual(paginationDto1);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(ramService, 'getCharacters').mockImplementation(() => {
        throw new NotFoundException();
      });

      try {
        await ramController.getCharacters(auth, queryParams);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(ramService.getCharacters).toHaveBeenCalledWith(
        auth.user.userId,
        queryParams.page,
      );
    });
  });

  describe('getCharacter', () => {
    const params = { id: 1 };

    it('should return a CharacterDto', async () => {
      jest.spyOn(ramService, 'getCharacter').mockResolvedValue(char1);

      const response = await ramController.getCharacter(auth, params);

      expect(ramService.getCharacter).toHaveBeenCalledWith(
        auth.user.userId,
        params.id,
      );
      expect(response).toEqual(char1);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(ramService, 'getCharacter').mockImplementation(() => {
        throw new NotFoundException();
      });

      try {
        await ramController.getCharacter(auth, params);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(ramService.getCharacter).toHaveBeenCalledWith(
        auth.user.userId,
        params.id,
      );
    });
  });

  describe('toggleCharacterFavorite', () => {
    const params = { id: 1 };
    const body = new AddCharacterToFavoriteDto();
    body.characterId = 1;
    body.page = 1;

    it('should call RamService with params', async () => {
      await ramController.toggleCharacterFavorite(auth, body);

      expect(ramService.toggleCharacterFromFavorites).toHaveBeenCalledWith(
        auth.user.userId,
        body.characterId,
        body.page,
      );
    });
  });
});
