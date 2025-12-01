import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';

// export class UpdateListDto extends PartialType(CreateListDto) {}
export class UpdateListDto {
  name?: string;
  description?: string;
  vocabulary?: string[]; // IDs des vocabulaires à garder
  itemsToDelete?: string[]; // IDs des VocabularyList items à supprimer
}
