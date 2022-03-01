import { Body, Controller, Get, Put, Query, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AddCharacterToFavoriteDto, CharacterDto } from '../dtos/character.dto';
import { PaginationDto } from '../dtos/pagination.dto';
import { PageParamDto } from '../dtos/queryParams.dto';
import { RamService } from '../services/ram.service';

@ApiTags('Rick and Morty API')
@Controller('ram')
export class RamController {
  constructor(private readonly ramService: RamService) {}

  @Get('characters')
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 3,
    required: false,
    description: 'Page to retrieve from the Rick and Morty API.',
  })
  @ApiOperation({ summary: 'Get Rick and Morty characters.' })
  @ApiOkResponse({
    description: 'Paginated list of Rick and Morty characters.',
    type: PaginationDto,
  })
  @ApiNotFoundResponse({ description: 'Authenticated user not found.' })
  @ApiBearerAuth('bearerAuth')
  async getCharacters(@Request() { user }, @Query() { page }: PageParamDto) {
    return this.ramService.getCharacters(user.userId, page);
  }

  @Put('characters')
  @ApiBody({ type: AddCharacterToFavoriteDto })
  @ApiOperation({
    summary: 'Adds/removes a character from favorites.',
  })
  @ApiOkResponse({
    description: 'Character added/removed from favorites.',
  })
  @ApiNotFoundResponse({ description: 'Authenticated user not found.' })
  @ApiBearerAuth('bearerAuth')
  async toggleCharacterFavorite(
    @Request() { user },
    @Body() { characterId, page }: AddCharacterToFavoriteDto,
  ) {
    await this.ramService.toggleCharacterFromFavorites(
      user.userId,
      characterId,
      page,
    );
  }
}
