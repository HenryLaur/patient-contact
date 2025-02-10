import { GenderNameType, SeedResponseDto } from '@contact-patient/dtos';
import { faker } from '@faker-js/faker';
import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { sample } from 'lodash';
import { GenderService } from '../modules/dal/gender/gender.service';
import { PatientService } from '../modules/dal/patient';

@Controller('seed')
export class SeedController {
  private defaultGenders: GenderNameType[] = ['female', 'male'];
  private defaultPatientsCount = 20;

  constructor(
    private readonly patientService: PatientService,
    private readonly genderService: GenderService
  ) {}

  @ApiOkResponse({
    description:
      'Sets up the database with some test data. All existing data will be overwritten.',
    type: SeedResponseDto,
  })
  @Post()
  async seed(): Promise<SeedResponseDto> {
    try {
      // Delete all patients
      console.log('Deleting patients...');
      await this.patientService.hardDeleteAll();

      // Delete all genders
      console.log('Deleting genders...');
      await this.genderService.hardDeleteAll();

      // Create genders
      console.log('Seeding genders...');
      const genderCreatePromises = [];
      for (const gender of this.defaultGenders) {
        genderCreatePromises.push(
          this.genderService.create({
            name: gender,
          })
        );
      }
      await Promise.all(genderCreatePromises);

      // Find all genders for use in patient creation
      const genders = await this.genderService.find();

      // Create patients
      console.log('Seeding patients...');
      const patientCreatePromises = [];
      for (let i = 0; i < this.defaultPatientsCount; i++) {
        // Select a random gender
        const gender = sample(genders);
        patientCreatePromises.push(
          this.patientService.create({
            firstName: faker.name.firstName(gender.name),
            lastName: faker.name.lastName(gender.name),
            ssn: faker.random.numeric(10).toString(),
            phoneNumber: faker.phone.number('+45 ## ## ## ##'),
            genderId: gender.id,
            contacted: faker.datatype.boolean(),
          })
        );
      }
      await Promise.all(patientCreatePromises);
    } catch (error) {
      console.error('An error occured seeding the database');
      console.error(error);
      return { success: false };
    }

    console.log('Seeding done!');
    return { success: true };
  }
}
