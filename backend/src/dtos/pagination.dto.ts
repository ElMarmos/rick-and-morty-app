import { ApiProperty } from '@nestjs/swagger';
import { CharacterDto } from './character.dto';

export class PaginationDto {
  @ApiProperty({
    description: 'Total number of characters.',
    example: 826,
  })
  count: number;

  @ApiProperty({
    description: 'Total number of pages.',
    example: 42,
  })
  pages: number;

  @ApiProperty({
    description: 'Number of the next page.',
    example: 4,
  })
  next: number | null;

  @ApiProperty({
    description: 'Number of the previous page.',
    example: 2,
  })
  prev: number | null;

  @ApiProperty({
    description: 'List of characters.',
    isArray: true,
    type: CharacterDto,
  })
  results: CharacterDto[];
}
