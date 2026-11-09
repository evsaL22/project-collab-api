import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Task } from '../entities/task.entity';
import { ProjectMembersService } from '../project-members/project-members.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly projectMembers: ProjectMembersService,
  ) {}

  private async ensureTask(taskId: number) {
    const task = await this.taskRepo.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException(`Task ${taskId} tidak ditemukan`);
    return task;
  }

  async create(taskId: number, dto: CreateCommentDto) {
    const task = await this.ensureTask(taskId);
    await this.projectMembers.assertIsMember(task.projectId, dto.authorId);

    const comment = await this.commentRepo.save(
      this.commentRepo.create({ taskId, authorId: dto.authorId, content: dto.content }),
    );
    return this.findOne(comment.id);
  }

  async findByTask(taskId: number) {
    await this.ensureTask(taskId);
    return this.commentRepo.find({
      where: { taskId },
      relations: { author: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!comment) throw new NotFoundException(`Comment ${id} tidak ditemukan`);
    return comment;
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.findOne(id);
    comment.content = dto.content;
    await this.commentRepo.save(comment);
    return this.findOne(id);
  }

  async remove(id: number) {
    const comment = await this.findOne(id);
    await this.commentRepo.remove(comment);
    return { message: `Comment ${id} berhasil dihapus` };
  }
}
