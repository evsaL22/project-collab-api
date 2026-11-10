import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Member } from '../../members/entities/member.entity';

/** Metadata file saja (tanpa penyimpanan cloud), disimpan di tabel "files". */
@Entity('files')
export class FileMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 100 })
  mimeType: string;

  /** ukuran dalam byte */
  @Column({ type: 'int' })
  size: number;

  /** lokasi/URL file (opsional, misalnya path lokal atau link eksternal) */
  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Relation<Project>;

  @Column({ type: 'int', nullable: true })
  uploadedById: number | null;

  @ManyToOne(() => Member, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: Relation<Member> | null;

  @CreateDateColumn()
  createdAt: Date;
}
