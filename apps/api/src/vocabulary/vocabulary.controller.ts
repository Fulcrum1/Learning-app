import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post('single')
  createSingle(@Body() createVocabularyDto: CreateVocabularyDto) {
    return this.vocabularyService.createSingle(createVocabularyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('multiple')
  createMultiple(@Body() createVocabularyDto: CreateVocabularyDto[], @Request() req: Request & { user: User }) {
    return this.vocabularyService.createMultiple(createVocabularyDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.vocabularyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVocabularyDto: UpdateVocabularyDto) {
    return this.vocabularyService.update(id, updateVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabularyService.remove(id);
  }
}
