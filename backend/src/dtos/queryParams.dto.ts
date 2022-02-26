import { Type } from 'class-transformer';
import { IsInt, ValidateIf } from 'class-validator';

export class PageParamDto {
  @ValidateIf(({ page }) => page != null)
  @IsInt()
  @Type(() => Number)
  page?: number;
}
