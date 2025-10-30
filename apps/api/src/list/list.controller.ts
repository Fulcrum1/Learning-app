import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import type { User } from '@prisma/client';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  // @Post()
  // create(@Body() createListDto: CreateListDto) {
  //   return this.listService.create(createListDto);
  // }

  @Post('manual')
  @UseGuards(AuthGuard('jwt'))
  createManual(@Req() req: Request & { user: User }, @Body() createListDto: CreateListDto) {
    console.log({user: req.user})
    return this.listService.createManual({
      ...createListDto,
      userId: req.user.id
    });
  }

  @Post('category')
  @UseGuards(AuthGuard('jwt'))
  createCategory(@Req() req: Request & { user: User }, @Body() createListDto: CreateListDto) {
    return this.listService.createCategory({
      ...createListDto,
      userId: req.user.id
    });
  }

  @Post('random')
  @UseGuards(AuthGuard('jwt'))
  createRandom(@Req() req: Request & { user: User }, @Body() createListDto: CreateListDto) {
    return this.listService.createRandom({
      ...createListDto,
      userId: req.user.id
    });
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
