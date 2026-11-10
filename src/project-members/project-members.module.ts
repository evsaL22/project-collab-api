import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { Member } from '../members/entities/member.entity';
import { ProjectMember } from '../entities/project-member.entity';
import { Task } from '../tasks/entities/task.entity';
import { ProjectMembersController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Member, ProjectMember, Task])],
  controllers: [ProjectMembersController],
  providers: [ProjectMembersService],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
