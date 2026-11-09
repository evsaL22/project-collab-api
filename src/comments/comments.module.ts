import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Task } from '../entities/task.entity';
import { ProjectMembersModule } from '../project-members/project-members.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Task]), ProjectMembersModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
