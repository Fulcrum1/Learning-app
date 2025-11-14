import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@prisma/client';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  private async createListWithUser(
    req: Request & { user: User },
    createListDto: CreateListDto,
  ) {
    if (!createListDto) {
      throw new UnauthorizedException('DTO invalide');
    }
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    const fullDto = {
      ...createListDto,
      userId,
    };
    
    return this.listService.create(fullDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('manual')
  createManual(
    @Req() req: Request & { user: User },
    @Body() createListDto: CreateListDto,
  ) {
    return this.createListWithUser(req, createListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('category')
  createCategory(
    @Req() req: Request & { user: User },
    @Body() createListDto: CreateListDto,
  ) {
    return this.createListWithUser(req, createListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('random')
  createRandom(
    @Req() req: Request & { user: User },
    @Body() createListDto: CreateListDto,
  ) {
    return this.createListWithUser(req, createListDto);
  }

  @Get()
  findAll() {
    return this.listService.findAll();
  }

  @Get('vocabulary-category')
  findAllVocabulary() {
    return this.listService.findVocabularyCategory();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.listService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('update-default')
  async updateDefaultList(@Req() req: Request & { user: User }) {
    try {
      return await this.listService.updateDefaultList(req.user?.id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    try {
      return await this.listService.update(id, updateListDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.listService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
