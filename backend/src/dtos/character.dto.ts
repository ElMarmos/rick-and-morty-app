import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

type Gender = 'Male' | 'Female' | 'Genderless' | 'unknown';
type Status = 'Alive' | 'Dead' | 'unknown';

export class CharacterDto {
  @ApiProperty({
    description: 'The id of the character.',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the character.',
    example: 'Rick Sanchez',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "The status of the character ('Alive', 'Dead' or 'unknown').",
    example: 'Alive',
  })
  @Expose()
  status: Status;

  @ApiProperty({
    description: 'The species of the character.',
    example: 'Rick Sanchez',
  })
  @Expose()
  species: string;

  @ApiProperty({
    description: 'The type or subspecies of the character.',
    example: '',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description:
      "The gender of the character ('Female', 'Male', 'Genderless' or 'unknown').",
    example: 'Male',
  })
  @Expose()
  gender: Gender;

  @ApiProperty({
    description: "Name of the character's origin location.",
  })
  @Transform(({ value }) => value.name)
  @Expose()
  origin: string;

  @ApiProperty({
    description: "Name of the character's last known location.",
  })
  @Transform(({ value }) => value.name)
  @Expose()
  location: string;

  @ApiProperty({
    description: "Link to the character's image.",
    example: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  })
  @Expose()
  image: string;

  @ApiProperty({
    description: 'List of episodes in which this character appeared.',
    example: [1, 2, 3, 4, 5],
  })
  @Expose({ name: 'episode' })
  @Transform(({ value }) => {
    return value.map((ep: string) => Number(ep.split('/')[5]));
  })
  episodes: number[];

  @ApiProperty({
    description: 'Shows if it is marked as favorite by the user.',
    example: true,
  })
  @Expose()
  isFavorite: boolean;
}

export class AddCharacterToFavoriteDto {
  @ApiProperty({
    description: 'The id of the character.',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  characterId: number;

  @ApiProperty({
    description: 'The page to which the character belongs.',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  page: number;
}
