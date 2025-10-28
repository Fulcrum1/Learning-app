import { PartialType } from '@nestjs/mapped-types';
import { CreateExpressionDto } from './create-expression.dto';

export class UpdateExpressionDto extends PartialType(CreateExpressionDto) {}
