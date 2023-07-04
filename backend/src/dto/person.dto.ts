import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Matches } from 'class-validator';

export class PersonDto {
  @IsString()
  @IsOptional()
  personId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  relationship: string;
}
