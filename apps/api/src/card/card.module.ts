import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { PrismaService } from '@prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Module({
  controllers: [CardController],
  providers: [CardService, PrismaService, JwtAuthGuard],
})
export class CardModule {}
