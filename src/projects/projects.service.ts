import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
  ) {}

  create(dto: CreateProjectDto) {
    return this.projectRepo.save(this.projectRepo.create(dto));
  }

  findAll() {
    return this.projectRepo
      .createQueryBuilder('project')
      .loadRelationCountAndMap('project.memberCount', 'project.projectMembers')
      .loadRelationCountAndMap('project.taskCount', 'project.tasks')
      .orderBy('project.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    const project = await this.projectRepo
      .createQueryBuilder('project')
      .loadRelationCountAndMap('project.memberCount', 'project.projectMembers')
      .loadRelationCountAndMap('project.taskCount', 'project.tasks')
      .where('project.id = :id', { id })
      .getOne();
    if (!project) throw new NotFoundException(`Project ${id} tidak ditemukan`);
    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.findOne(id);
    Object.assign(project, dto);
    await this.projectRepo.save(project);
    return this.findOne(id);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    await this.projectRepo.remove(project);
    return { message: `Project ${id} berhasil dihapus` };
  }
}
