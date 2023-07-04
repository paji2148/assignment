import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { InsuranceApplicationService } from './insurance-app.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { PersonDto } from './dto/person.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { InsuranceApplicationDto } from './dto/insurance-application.dto';
import { ConfigService } from '@nestjs/config';

@Controller('insurance-application')
export class InsuranceApplicationController {
  constructor(private readonly insuranceAppService: InsuranceApplicationService,
    private readonly config: ConfigService) {}

  @Post()
  async createInsuranceApplication(@Body() createDto: CreateApplicationDto): Promise<{ resumeUrl: string; applicationId: string }> {
    const applicationId = await this.insuranceAppService.createApplication(createDto);
    const resumeUrl = `${this.config.get('SERVER')}/insurance-application?applicationId=${applicationId}`;
    return { resumeUrl, applicationId };
  }

  @Get()
  async getApplication(@Query('id') applicationId: string): Promise<InsuranceApplicationDto> {
    return this.insuranceAppService.getApplication(applicationId);
  }

  @Post(':id/submit')
  async submitApplication(@Param('id') applicationId: string): Promise<{price: number}> {
    const price = await this.insuranceAppService.submitApplication(applicationId);
    return { price }
  }

  @Delete(':id')
  async deleteApplication(@Param('id') applicationId: string): Promise<{ message: string; }> {
    await this.insuranceAppService.deleteApplication(applicationId);
    return { message: 'Application deleted successfully' };
  }

  @Put(':id')
  async updateInsuranceApplication(@Param('id') applicationId: string, @Body() updateDto: CreateApplicationDto): Promise<void> {
    await this.insuranceAppService.updateApplication(applicationId, updateDto);
  }

  @Post(':id/person')
  async addPersonToInsurance(@Param('id') applicationId: string, @Body() person: PersonDto): Promise<{ personId: string; }> {
    const personId = await this.insuranceAppService.addPerson(applicationId, person);
    return { personId };
  }

  @Put(':id/person/:personId')
  async updatePersonToInsurance(
    @Param('id') applicationId: string,
    @Param('personId') personId: string,
    @Body() person: PersonDto
  ): Promise<{ personId: string; }> {
    const updatedPersonId = await this.insuranceAppService.updatePerson(applicationId, personId, person);
    return { personId: updatedPersonId };
  }

  @Delete(':id/person/:personId')
  async deletePersonToInsurance(@Param('id') applicationId: string, @Param('personId') personId: string): Promise<{ message: string; }> {
    await this.insuranceAppService.deleteAdditionalPerson(applicationId, personId);
    return { message: 'Additional person deleted successfully' };
  }

  @Post(':id/vehicle')
  async addVehicleToInsurance(@Param('id') applicationId: string, @Body() vehicle: VehicleDto): Promise<{ vehicleId: string; }> {
    const vehicleId = await this.insuranceAppService.addVehicle(applicationId, vehicle);
    return { vehicleId };
  }

  @Put(':id/vehicle/:vehicleId')
  async updateVehicleToInsurance(
    @Param('id') applicationId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() vehicle: VehicleDto
  ): Promise<{ vehicleId: string; }> {
    const updatedVehicleId = await this.insuranceAppService.updateVehicle(applicationId, vehicleId, vehicle);
    return { vehicleId: updatedVehicleId };
  }

  @Delete(':id/vehicle/:vehicleId')
  async deleteVehicleToInsurance(@Param('id') applicationId: string, @Param('vehicleId') vehicleId: string): Promise<{ message: string; }> {
    await this.insuranceAppService.deleteVehicle(applicationId, vehicleId);
    return { message: 'Vehicle deleted successfully' };
  }

}
