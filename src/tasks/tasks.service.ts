import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { ProjectMembersService } from '../project-members/project-members.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    private readonly projectMembers: ProjectMembersService,
  ) {}

  async create(projectId: number, dto: CreateTaskDto) {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project ${projectId} tidak ditemukan`);

    if (dto.assigneeId != null) {
      await this.projectMembers.assertIsMember(projectId, dto.assigneeId);
    }

    const task = await this.taskRepo.save(
      this.taskRepo.create({ ...dto, projectId }),
    );
    return this.findOne(task.id);
  }

  async findByProject(projectId: number, query: FindTasksQueryDto) {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project ${projectId} tidak ditemukan`);

    return this.taskRepo.find({
      where: {
        projectId,
        ...(query.status && { status: query.status }),
        ...(query.priority && { priority: query.priority }),
        ...(query.assigneeId && { assigneeId: query.assigneeId }),
      },
      relations: { assignee: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const task = await this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .loadRelationCountAndMap('task.commentCount', 'task.comments')
      .where('task.id = :id', { id })
      .getOne();
    if (!task) throw new NotFoundException(`Task ${id} tidak ditemukan`);
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id);

    if (dto.assigneeId != null) {
      await this.projectMembers.assertIsMember(task.projectId, dto.assigneeId);
    }

    const { commentCount, assignee, ...plain } = task;
    await this.taskRepo.save({ ...plain, ...dto });
    return this.findOne(id);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.taskRepo.delete(task.id);
    return { message: `Task ${id} berhasil dihapus` };
  }
}
