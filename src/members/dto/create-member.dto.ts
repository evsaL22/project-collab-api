import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;
}
