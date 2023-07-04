import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class VehicleDto {
  @IsString()
  @IsOptional()
  vehicleId: string;
  
  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;
}
