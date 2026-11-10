import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
  ) {}

  private async ensureEmailFree(email: string, ignoreId?: number) {
    const existing = await this.memberRepo.findOneBy({ email });
    if (existing && existing.id !== ignoreId) {
      throw new ConflictException(`Email ${email} sudah digunakan`);
    }
  }

  async create(dto: CreateMemberDto) {
    await this.ensureEmailFree(dto.email);
    return this.memberRepo.save(this.memberRepo.create(dto));
  }

  findAll() {
    return this.memberRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const member = await this.memberRepo.findOneBy({ id });
    if (!member) throw new NotFoundException(`Member ${id} tidak ditemukan`);
    return member;
  }

  async update(id: number, dto: UpdateMemberDto) {
    const member = await this.findOne(id);
    if (dto.email) await this.ensureEmailFree(dto.email, id);
    Object.assign(member, dto);
    return this.memberRepo.save(member);
  }

  async remove(id: number) {
    const member = await this.findOne(id);
    await this.memberRepo.remove(member);
    return { message: `Member ${id} berhasil dihapus` };
  }
}
