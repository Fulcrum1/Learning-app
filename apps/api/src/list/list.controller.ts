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

  @UseGuards(JwtAuthGuard)
  @Post('manual')
  createManual(
    @Req() req: Request & { user: User },
    @Body() createListDto: CreateListDto,
  ) {
    console.log({ req: req.body });
    console.log({ DTO: createListDto });
    console.log({ Utilisateur: req.user });

    if (!createListDto) {
      throw new UnauthorizedException('DTO invalide');
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    // Crée un nouvel objet avec userId
    const fullDto = {
      ...createListDto,
      userId,
    };

    console.log({ DTOFinal: fullDto });
    return this.listService.createManual(fullDto);
  }

  @Post('category')
  createCategory(
    @Req() req: Request & { user: User },
    @Body() createListDto: CreateListDto,
  ) {
    if (!createListDto.userId) {
      const user = req.user;
      createListDto.userId = user?.id;
    }
    return this.listService.createCategory(createListDto);
  }

  @Post('random')
  createRandom(
    @Req() req: Request & { user: User },
    @Body() createListDto: CreateListDto,
  ) {
    if (!createListDto.userId) {
      const user = req.user;
      createListDto.userId = user?.id;
    }
    return this.listService.createRandom(createListDto);
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
      throw error; // La gestion des erreurs est déjà faite dans le service
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    try {
      return await this.listService.update(id, updateListDto);
    } catch (error) {
      throw error; // La gestion des erreurs est déjà faite dans le service
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.listService.remove(id);
    } catch (error) {
      throw error; // La gestion des erreurs est déjà faite dans le service
    }
  }
}
