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
import { ProjectMembersService } from './project-members.service';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';

@Controller('projects/:projectId/members')
export class ProjectMembersController {
  constructor(private readonly service: ProjectMembersService) {}

  @Post()
  add(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: AddProjectMemberDto,
  ) {
    return this.service.add(projectId, dto);
  }

  @Get()
  findAll(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.service.findByProject(projectId);
  }

  @Patch(':memberId')
  updateRole(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() dto: UpdateProjectMemberDto,
  ) {
    return this.service.updateRole(projectId, memberId, dto);
  }

  @Delete(':memberId')
  remove(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.service.remove(projectId, memberId);
  }
}
