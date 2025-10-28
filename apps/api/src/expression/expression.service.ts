import { Injectable } from '@nestjs/common';
import { CreateExpressionDto } from './dto/create-expression.dto';
import { UpdateExpressionDto } from './dto/update-expression.dto';

@Injectable()
export class ExpressionService {
  create(createExpressionDto: CreateExpressionDto) {
    return 'This action adds a new expression';
  }

  findAll() {
    return `This action returns all expression`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expression`;
  }

  update(id: number, updateExpressionDto: UpdateExpressionDto) {
    return `This action updates a #${id} expression`;
  }

  remove(id: number) {
    return `This action removes a #${id} expression`;
  }
}
