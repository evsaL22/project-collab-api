import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileMetadata } from '../entities/file-metadata.entity';
import { Project } from '../entities/project.entity';
import { ProjectMembersModule } from '../project-members/project-members.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileMetadata, Project]), ProjectMembersModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
