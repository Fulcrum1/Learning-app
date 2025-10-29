import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  createManual(@Body() createListDto: CreateListDto) {
    return this.listService.createManual(createListDto);
  }

  @Post('category')
  createCategory(@Body() createListDto: CreateListDto) {
    return this.listService.createCategory(createListDto);
  }

  @Post('random')
  createRandom(@Body() createListDto: CreateListDto) {
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
