import { IsEnum, IsInt, IsOptional } from "class-validator";
import { ProjectRole } from "../entities/project-member.entity";

export class AddProjectMemberDto {
  @IsInt()
  memberId: number;

  @IsOptional()
  @IsEnum(ProjectRole)
  role?: ProjectRole;
}
