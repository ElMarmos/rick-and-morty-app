import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { IsNotBlank } from 'src/validators/isNotBlank.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNotBlank()
  @Length(1, 36)
  @ApiProperty({
    description: 'Username.',
    example: 'rick_sanchez',
  })
  username: string;

  @IsNotEmpty()
  @IsNotBlank()
  @Length(8, 36)
  @ApiProperty({
    description: 'Password of the user.',
    minLength: 8,
    maxLength: 36,
    example: 'wubalubadubdub!',
  })
  password: string;
}
