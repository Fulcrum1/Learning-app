import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  listId: string;
  vocabularyId: string;
  isKnown: boolean;
}
