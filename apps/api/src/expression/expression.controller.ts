import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpressionService } from './expression.service';
import { CreateExpressionDto } from './dto/create-expression.dto';
import { UpdateExpressionDto } from './dto/update-expression.dto';

@Controller('expression')
export class ExpressionController {
  constructor(private readonly expressionService: ExpressionService) {}

  @Post()
  create(@Body() createExpressionDto: CreateExpressionDto) {
    return this.expressionService.create(createExpressionDto);
  }

  @Get()
  findAll() {
    return this.expressionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expressionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpressionDto: UpdateExpressionDto) {
    return this.expressionService.update(+id, updateExpressionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expressionService.remove(+id);
  }
}
