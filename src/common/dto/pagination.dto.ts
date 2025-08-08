import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  perPage: number = 10;
}
