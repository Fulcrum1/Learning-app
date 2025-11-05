import { PartialType } from '@nestjs/mapped-types';
import { CreateCardParamDto } from './create-card-param.dto';

export class UpdateCardParamDto extends PartialType(CreateCardParamDto) {}
