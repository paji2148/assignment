// create-application.dto.ts
import { IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { Matches } from 'class-validator';

export class CreateApplicationDto {

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

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => AddressDto)
  address: AddressDto;
}
