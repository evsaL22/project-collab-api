import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Member } from '../../members/entities/member.entity';

export enum ProjectRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

/** Tabel penghubung many-to-many antara Projects dan Members. */
@Entity('project_members')
@Unique(['projectId', 'memberId'])
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @Column()
  memberId: number;

  @ManyToOne(() => Project, (project) => project.projectMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Relation<Project>;

  @ManyToOne(() => Member, (member) => member.projectMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  member: Relation<Member>;

  @Column({ type: 'enum', enum: ProjectRole, default: ProjectRole.MEMBER })
  role: ProjectRole;

  @CreateDateColumn()
  joinedAt: Date;
}
