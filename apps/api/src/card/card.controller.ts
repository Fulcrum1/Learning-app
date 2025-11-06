import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CardService } from './card.service';
import { UpdateCardParamDto } from './dto/update-card-param.dto';
import { Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import type { User } from '@prisma/client';
import type { Request } from 'express';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // Get all the vocabulary from a list
  @Get('vocabulary-card/:id')
  findAllVocabularyCard(
    @Param('id') id: string,
    @Query('reset') reset: boolean | undefined,
  ) {
    return this.cardService.findVocabularyCard(id, reset);
  }

  // Get the param of a user
  @UseGuards(JwtAuthGuard)
  @Get('param-card')
  findAllParamCard(@Req() req: Request & { user: User }) {
    return this.cardService.findParamCard(req.user.id);
  }

  // Update the param of a user
  @UseGuards(JwtAuthGuard)
  @Put('param-card')
  updateParamCard(
    @Req() req: Request & { user: User },
    @Body() updateCardParamDto: UpdateCardParamDto,
  ) {
    return this.cardService.updateParamCard(req.user.id, updateCardParamDto);
  }

  // Update the progress of a user
  @UseGuards(JwtAuthGuard)
  @Put('progress-card')
  updateProgressCard(
    @Req() req: Request & { user: User },
    @Body() body: { listId: string, vocabularyId: string, isKnown: boolean },
  ) {
    return this.cardService.updateProgress(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('rollback-progress-card')
  rollbackProgressCard(
    @Req() req: Request & { user: User },
    @Body() body: { listId: string, vocabularyId: string },
  ) {
    return this.cardService.rollbackProgress(req.user.id, body);
  }

  // Reset the list of a user
  @UseGuards(JwtAuthGuard)
  @Put('reset-card')
  resetCard(
    @Req() req: Request & { user: User },
    @Body() body: { listId: string },
  ) {
    return this.cardService.resetCard(req.user.id, body);
  }
}
