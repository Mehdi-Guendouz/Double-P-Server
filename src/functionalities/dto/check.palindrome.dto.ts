import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class PalindromeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'word is too short',
  })
  @MaxLength(50, {
    message: 'word is too long',
  })
  word: string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'description is too short',
  })
  @MaxLength(50, {
    message: 'description is too long',
  })
  description: string;
}

export class NumberParfaitDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0, {
    message: 'Number must be greater than 0',
  })
  @Max(1000000, {
    message: 'Number must be less than 1000000',
  })
  number: number;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'description is too short',
  })
  @MaxLength(50, {
    message: 'description is too long',
  })
  description: string;
}
