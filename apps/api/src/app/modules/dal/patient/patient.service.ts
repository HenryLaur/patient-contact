import {
  DetailedPatientDto,
  ListPatientDto,
  PatientIndexDto,
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
      order: {
        id: 'ASC',
      },
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
    const existingPatient = await this.repo.findOne(id);

    if (!existingPatient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
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

  /**
   * Finds the next patient based on the current patient's ID.
   * Orders by id and returns the next patient in sequence.
   * @param currentId Current patient's ID
   * @returns PatientIndexDto the next and previous patient ids, current index and total number of patients
   */
  async getPatientIndex(
    currentId: string,
    contacted: boolean
  ): Promise<PatientIndexDto> {
    const currentPatient = await this.repo.findOne(currentId);
    if (!currentPatient) {
      throw new NotFoundException(`Patient with id ${currentId} not found`);
    }

    const patients = await this.repo.find({
      where: { contacted: contacted },
      order: {
        id: 'ASC',
      },
    });
    // This searching can be a bit slow so it might be a bit faster if we find the indexes and total count in sql
    const currentIndex = patients.findIndex((p) => p.id === currentId);
    if (currentIndex === -1) {
      throw new NotFoundException('Current patient not found');
    }

    return {
      total: patients.length,
      currentIndex: currentIndex + 1,
      nextId:
        currentIndex < patients.length - 1
          ? patients[currentIndex + 1].id
          : null,
      prevId: currentIndex > 0 ? patients[currentIndex - 1].id : null,
    };
  }
}
