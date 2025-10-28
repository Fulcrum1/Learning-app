import { Injectable } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  createSingle(createVocabularyDto: CreateVocabularyDto) {
    const vocabulary = this.prisma.vocabulary.create({
      data: createVocabularyDto,
    })
    return vocabulary;
  }

  createMultiple(createVocabularyDto: CreateVocabularyDto[]) {
    console.log({createVocabularyDto})
    const vocabulary = this.prisma.vocabulary.createMany({
      data: createVocabularyDto,
    })
    return vocabulary;
  }

  findAll() {
    const vocabulary = this.prisma.vocabulary.findMany()
    return vocabulary;
  }

  findOne(id: string) {
    const vocabulary = this.prisma.vocabulary.findUnique({
      where: {
        id: id,
      },
    })
    return vocabulary;
  }

  update(id: string, updateVocabularyDto: UpdateVocabularyDto) {
    const vocabulary = this.prisma.vocabulary.update({
      where: {
        id: id,
      },
      data: updateVocabularyDto,
    })
    return vocabulary;
  }

  remove(id: string) {
    const vocabulary = this.prisma.vocabulary.delete({
      where: {
        id: id,
      },
    })
    return vocabulary;
  }
}
