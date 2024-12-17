import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'userName is too short',
  })
  @MaxLength(50, {
    message: 'userName is too long',
  })
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Password is too short',
  })
  password: string;
}
