import {
  DetailedPatientDto,
  ListPatientDto,
  UpdatePatientDto,
} from '@contact-patient/dtos';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly repo: Repository<Patient>
  ) {}

  /**
   * Finds all patient information for a given patient id.
   * Includes a join on the gender entity.
   * @param id  Patient id.
   * @returns   DetailedPatientDto
   */
  async findOne(id: string): Promise<DetailedPatientDto> {
    return this.repo.findOne(id, {
      relations: ['gender'],
    });
  }

  /**
   * Finds all patients that have been contacted or not contacted.
   * Only returns patient details needed for listing.
   * @param contacted If true, only contacted patients are returned. If false, only not contacted patients are returned.
   * @returns         ListPatientDto[]
   */
  async find(contacted: boolean): Promise<ListPatientDto[]> {
    return this.repo.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'contacted',
        'created',
        'updated',
      ],
      where: { contacted: contacted },
    });
  }

  /**
   * Returns the count of patients that have been contacted or not contacted.
   * @param contacted If true, only contacted patients are counted. If false, only not contacted patients are counted.
   * @returns         Count as number.
   */
  async count(contacted: boolean): Promise<number> {
    return this.repo.count({ contacted: contacted });
  }

  /**
   * Creates a patient. Not needed for this exercise, but included for seeding patients.
   * @param patient  Patient to create.
   * @returns         Patient
   */
  async create(patient: Partial<Patient>): Promise<Patient> {
    return this.repo.save(patient);
  }

  /**
   * Updates a patient. Only the fields that are provided will be updated.
   * @param id        Patient id.
   * @param patient   UpdatePatientDto.
   * @returns         DetailedPatientDto with updated data.
   */
  async update(
    id: string,
    patient: UpdatePatientDto
  ): Promise<DetailedPatientDto> {
    const existingPatient = await this.repo.findOne(patient.id);

    if (!existingPatient) {
      throw new NotFoundException(`Patient with id ${patient.id} not found`);
    }

    return this.repo.save({
      ...existingPatient,
      ...patient,
    });
  }

  /**
   * Function used for deleting all patients.
   * @returns
   */
  async hardDeleteAll(): Promise<boolean> {
    await this.repo.createQueryBuilder().delete().where('true').execute();
    return true;
  }
}
