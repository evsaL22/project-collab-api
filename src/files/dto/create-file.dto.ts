import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  mimeType: string;

  /** ukuran file dalam byte */
  @IsInt()
  @Min(0)
  size: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  /** opsional; jika diisi harus anggota project */
  @IsOptional()
  @IsInt()
  uploadedById?: number;
}
