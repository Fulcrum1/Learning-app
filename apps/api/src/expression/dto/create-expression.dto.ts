import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateExpressionDto {
  @IsString()
  name: string;

  @IsString()
  translation: string;

  @IsString()
  @IsOptional()
  pronunciation?: string;

  @IsArray()
  @IsOptional()
  listIds?: string[];

  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}
