import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from './gender.entity';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private readonly repo: Repository<Gender>
  ) {}

  /**
   * Returns all genders.
   * @returns
   */
  async find(): Promise<Gender[]> {
    return this.repo.find();
  }

  /**
   * Creates a gender.
   * @param gender
   * @returns
   */
  async create(gender: Partial<Gender>): Promise<Gender> {
    return this.repo.save(gender);
  }

  /**
   * Function used for deleting all genders.
   * @returns
   */
  async hardDeleteAll(): Promise<boolean> {
    await this.repo.createQueryBuilder().delete().where('true').execute();
    return true;
  }
}
