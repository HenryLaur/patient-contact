import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allDatabaseEntities } from './entities.union';
import { GenderService } from './gender/gender.service';
import { PatientService } from './patient';

@Module({
  imports: [TypeOrmModule.forFeature(allDatabaseEntities)],
  providers: [PatientService, GenderService],
  exports: [PatientService, GenderService],
})
export class DalModule {}
