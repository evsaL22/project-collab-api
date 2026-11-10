import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileMetadata } from './entities/file-metadata.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectMembersService } from '../project-members/project-members.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileMetadata) private readonly fileRepo: Repository<FileMetadata>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    private readonly projectMembers: ProjectMembersService,
  ) {}

  async create(projectId: number, dto: CreateFileDto) {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project ${projectId} tidak ditemukan`);

    if (dto.uploadedById != null) {
      await this.projectMembers.assertIsMember(projectId, dto.uploadedById);
    }

    const file = await this.fileRepo.save(this.fileRepo.create({ ...dto, projectId }));
    return this.findOne(file.id);
  }

  async findByProject(projectId: number) {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project ${projectId} tidak ditemukan`);

    return this.fileRepo.find({
      where: { projectId },
      relations: { uploadedBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const file = await this.fileRepo.findOne({
      where: { id },
      relations: { uploadedBy: true },
    });
    if (!file) throw new NotFoundException(`File ${id} tidak ditemukan`);
    return file;
  }

  async update(id: number, dto: UpdateFileDto) {
    const file = await this.findOne(id);

    if (dto.uploadedById != null) {
      await this.projectMembers.assertIsMember(file.projectId, dto.uploadedById);
    }

    const { uploadedBy, ...plain } = file;
    await this.fileRepo.save({ ...plain, ...dto });
    return this.findOne(id);
  }

  async remove(id: number) {
    const file = await this.findOne(id);
    await this.fileRepo.delete(file.id);
    return { message: `File ${id} berhasil dihapus` };
  }
}
