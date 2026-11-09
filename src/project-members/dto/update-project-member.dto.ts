import { IsEnum } from 'class-validator';
import { ProjectRole } from '../../entities/project-member.entity';

export class UpdateProjectMemberDto {
  @IsEnum(ProjectRole)
  role: ProjectRole;
}
