import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './utils/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { PersonDto } from './dto/person.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { InsuranceApplicationDto } from './dto/insurance-application.dto';
// import { SubmitApplicationDto } from './dto/submit-application.dto';

@Injectable()
export class InsuranceApplicationService {
  constructor(private readonly prismaService: PrismaService) {}

  private validateAge(dateOfBirth: string, minAge: number): boolean {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    return age > minAge || (age === minAge && m >= 0);
  }

  private async countVehicles(applicationId: string): Promise<number> {
    return this.prismaService.vehicle.count({
      where: {
        applicationId,
      },
    });
  }

  private async isApplicationSubmitted(applicationId: string): Promise<boolean> {
    const application = await this.prismaService.insuranceApplication.findUnique({
      where: { id: applicationId },
      select: { submitted: true },
    });
    return application?.submitted;
  }

  async createApplication(createDto: CreateApplicationDto): Promise<string> {
    if (!this.validateAge(createDto.dateOfBirth, 16)) {
      throw new BadRequestException('Primary applicant must be at least 16 years old');
    }

    // Validate ZipCode is numeric
    if (isNaN(Number(createDto.address.zipCode))) {
      throw new BadRequestException('Zip Code must be numeric');
    }

    const createdApplication = await this.prismaService.insuranceApplication.create({
      data: {
        ...createDto,
        address: {
          create: createDto.address,
        },
      },
    });

    return createdApplication.id;
  }

  async updateApplication(applicationId: string, updateDto: CreateApplicationDto): Promise<void> {
    if (await this.isApplicationSubmitted(applicationId)) {
      throw new BadRequestException('Application already submitted, no modifications allowed');
    }

    // Validate ZipCode is numeric
    if (isNaN(Number(updateDto.address.zipCode))) {
      throw new BadRequestException('Zip Code must be numeric');
    }

    if (!this.validateAge(updateDto.dateOfBirth, 16)) {
      throw new BadRequestException('Primary applicant must be at least 16 years old');
    }
  
    const updatedApplication = await this.prismaService.insuranceApplication.update({
      where: { id: applicationId },
      data: {
        firstName: updateDto.firstName,
        lastName: updateDto.lastName,
        // email: updateDto.email,
        dateOfBirth: updateDto.dateOfBirth,
        // Update other fields as needed
      },
    });
  
    return;
  }
  

  async addPerson(applicationId: string, person: PersonDto): Promise<string> {
    if (await this.isApplicationSubmitted(applicationId)) {
      throw new BadRequestException('Application already submitted, no modifications allowed');
    }

    if (!this.validateAge(person.dateOfBirth, 16)) {
      throw new BadRequestException('Additional person must be at least 16 years old');
    }

    const createdPerson = await this.prismaService.additionalPerson.create({
      data: {
        ...person,
        applicationId,
      },
    });

    return createdPerson.id;
  }

  async addVehicle(applicationId: string, vehicle: VehicleDto): Promise<string> {
    if (await this.isApplicationSubmitted(applicationId)) {
      throw new BadRequestException('Application already submitted, no modifications allowed');
    }

    // Validate Vehicle year
    if (vehicle.year < 1985 || vehicle.year > new Date().getFullYear() + 1) {
      throw new BadRequestException('Vehicle year should be from 1985 and ' + (new Date().getFullYear() + 1));
    }

    const vehicleCount = await this.countVehicles(applicationId);
    if (vehicleCount >= 3) {
      throw new BadRequestException('Maximum of 3 vehicles per application is allowed');
    }

    const createdVehicle = await this.prismaService.vehicle.create({
      data: {
        ...vehicle,
        applicationId,
      },
    });

    return createdVehicle.id;
  }

  async updatePerson(applicationId: string, personId: string, person: PersonDto): Promise<string> {
    if (await this.isApplicationSubmitted(applicationId)) {
      throw new BadRequestException('Application already submitted, no modifications allowed');
    }

    const application = await this.prismaService.insuranceApplication.findUnique({
        where: { id: applicationId },
    });

    if (!application) {
        throw new NotFoundException('Application not found');
    }

    const updatedPerson = await this.prismaService.additionalPerson.update({
        where: { id: personId },
        data: {
            ...person,
        },
    });

    if (!updatedPerson) {
        throw new NotFoundException('Failed to update the person');
    }

    return updatedPerson.id;
  }

  async updateVehicle(applicationId: string, vehicleId: string, vehicle: VehicleDto): Promise<string> {
    if (await this.isApplicationSubmitted(applicationId)) {
      throw new BadRequestException('Application already submitted, no modifications allowed');
    }

    // Validate Vehicle year
    if (vehicle.year < 1985 || vehicle.year > new Date().getFullYear() + 1) {
      throw new BadRequestException('Vehicle year should be from 1985 and ' + (new Date().getFullYear() + 1));
    }


    const updatedVehicle = await this.prismaService.vehicle.update({
      where: { id: vehicleId },
      data: vehicle,
    });

    return updatedVehicle.id;
  }

  async deleteVehicle(applicationId: string, vehicleId: string): Promise<void> {
    if (await this.isApplicationSubmitted(applicationId)) {
      throw new BadRequestException('Application already submitted, no modifications allowed');
    }

    await this.prismaService.vehicle.delete({
      where: { id: vehicleId },
    });
  }

  async deleteAdditionalPerson(applicationId: string, personId: string): Promise<void> {
    if (await this.isApplicationSubmitted(applicationId)) {
      throw new BadRequestException('Application already submitted, no modifications allowed');
    }

    await this.prismaService.additionalPerson.delete({
      where: { id: personId },
    });
  }

  async deleteApplication(applicationId: string): Promise<void> {
    if (await this.isApplicationSubmitted(applicationId)) {
      throw new BadRequestException('Application already submitted, no modifications allowed');
    }

    const application = await this.prismaService.insuranceApplication.findUnique({
        where: { id: applicationId },
    });

    if (!application) {
        throw new NotFoundException('Application not found');
    }

    await this.prismaService.insuranceApplication.delete({
      where: { id: applicationId },
    });
  }

  // Service method

async getApplication(applicationId: string): Promise<InsuranceApplicationDto> {
  const application = await this.prismaService.insuranceApplication.findUnique({
    where: { id: applicationId },
    include: {
      address: true,
      vehicles: true,
      additionalPeople: true,
    },
  });

  if (!application) {
    throw new NotFoundException('Application not found');
  }

    // Check if the application is submitted
    if (application.submitted) {
        return {
          applicationId,
            submitted: true,
            price: application.price
        };
    }

  // Constructing the response object
  const formattedResponse = {
    applicationId: application.id,
    firstName: application.firstName,
    lastName: application.lastName,
    dateOfBirth: application.dateOfBirth,
    address: {
      street: application.address.street,
      city: application.address.city,
      state: application.address.state,
      zipCode: application.address.zipCode,
    },
    persons: application.additionalPeople.map(person => ({
      firstName: person.firstName,
      lastName: person.lastName,
      dateOfBirth: person.dateOfBirth,
      relationship: person.relationship,
      personId: person.id,
    })),
    vehicles: application.vehicles.map(vehicle => ({
      vin: vehicle.vin,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      vehicleId: vehicle.id,
    })),
  };

  console.log(formattedResponse);

    return formattedResponse;
  }



  async submitApplication(applicationId: string): Promise<number> {
    const application = await this.prismaService.insuranceApplication.findUnique({
      where: {
        id: applicationId
      },
      include: {
        vehicles: true
      }
    })

    if (!application) {
        throw new NotFoundException('Application not found');
    }

    if (application.vehicles.length === 0) {
        throw new BadRequestException('At least one vehicle is required to submit the application');
    }
    let price;
    if (application.submitted) {
      price = application.price
    } else{
      price = Math.random() * (1000 - 100) + 100;

      await this.prismaService.insuranceApplication.update({
        where: { id: applicationId },
        data: {
          price: price,
          submitted: true
        }
    });

    }
    return price;
  }
}
