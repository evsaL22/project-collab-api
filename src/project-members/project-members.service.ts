import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Member } from '../entities/member.entity';
import { ProjectMember, ProjectRole } from '../entities/project-member.entity';
import { Task } from '../entities/task.entity';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
    @InjectRepository(ProjectMember)
    private readonly pmRepo: Repository<ProjectMember>,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  ) {}

  private async ensureProject(projectId: number) {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project ${projectId} tidak ditemukan`);
    return project;
  }

  private async findLink(projectId: number, memberId: number) {
    const link = await this.pmRepo.findOne({
      where: { projectId, memberId },
      relations: { member: true },
    });
    if (!link) {
      throw new NotFoundException(
        `Member ${memberId} bukan anggota project ${projectId}`,
      );
    }
    return link;
  }

  /** Dipakai module lain (tasks, comments, files) untuk validasi keanggotaan. */
  async assertIsMember(projectId: number, memberId: number) {
    const exists = await this.pmRepo.exist({ where: { projectId, memberId } });
    if (!exists) {
      throw new BadRequestException(
        `Member ${memberId} bukan anggota project ${projectId}`,
      );
    }
  }

  async add(projectId: number, dto: AddProjectMemberDto) {
    await this.ensureProject(projectId);

    const member = await this.memberRepo.findOneBy({ id: dto.memberId });
    if (!member) throw new NotFoundException(`Member ${dto.memberId} tidak ditemukan`);

    const already = await this.pmRepo.exist({
      where: { projectId, memberId: dto.memberId },
    });
    if (already) {
      throw new ConflictException(
        `Member ${dto.memberId} sudah menjadi anggota project ${projectId}`,
      );
    }

    await this.pmRepo.save(
      this.pmRepo.create({
        projectId,
        memberId: dto.memberId,
        role: dto.role ?? ProjectRole.MEMBER,
      }),
    );
    return this.findLink(projectId, dto.memberId);
  }

  async findByProject(projectId: number) {
    await this.ensureProject(projectId);
    return this.pmRepo.find({
      where: { projectId },
      relations: { member: true },
      order: { joinedAt: 'ASC' },
    });
  }

  async updateRole(projectId: number, memberId: number, dto: UpdateProjectMemberDto) {
    const link = await this.findLink(projectId, memberId);
    link.role = dto.role;
    await this.pmRepo.save(link);
    return this.findLink(projectId, memberId);
  }

  async remove(projectId: number, memberId: number) {
    const link = await this.findLink(projectId, memberId);

    // tugas yang di-assign ke member ini di project tsb dilepas (unassigned)
    await this.taskRepo.update({ projectId, assigneeId: memberId }, { assigneeId: null });

    await this.pmRepo.remove(link);
    return { message: `Member ${memberId} dikeluarkan dari project ${projectId}` };
  }
}
