import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('projects/:projectId/files')
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateFileDto,
  ) {
    return this.filesService.create(projectId, dto);
  }

  @Get('projects/:projectId/files')
  findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.filesService.findByProject(projectId);
  }

  @Get('files/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Patch('files/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFileDto) {
    return this.filesService.update(id, dto);
  }

  @Delete('files/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}
