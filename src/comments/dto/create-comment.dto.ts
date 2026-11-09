import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  /** id member penulis komentar (harus anggota project dari task tsb) */
  @IsInt()
  authorId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
