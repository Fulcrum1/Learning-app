import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService, PrismaService, JwtAuthGuard],
})
export class VocabularyModule {}
