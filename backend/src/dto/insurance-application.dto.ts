export class AddressDto {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export class VehicleDto {
  vehicleId?: string;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
}

export class PersonDto {
  personId?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  relationship?: string;
}

export class InsuranceApplicationDto {
  applicationId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: AddressDto;
  persons?: PersonDto[];
  vehicles?: VehicleDto[];
  submitted?: boolean;
  price?: number;
}
