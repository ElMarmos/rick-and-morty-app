import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationDto {
  @ApiProperty({ example: 'rick_sanchez' })
  username: string;
  @ApiProperty({ example: 'wubalubadubdub!' })
  password: string;
}

export class TokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
