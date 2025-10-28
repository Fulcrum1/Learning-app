import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateVocabularyDto {
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
  categoryNames?: string[];
}
