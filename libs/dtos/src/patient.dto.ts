import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { GenderDto } from './gender.dto';

/**
 * DTO for necessary details for a patient, e.g. for list views.
 */
export class ListPatientDto {
  @ApiProperty({
    description: 'Unique identifier for the patient',
  })
  id: string;

  @ApiProperty({
    description: 'First name of the patient',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the patient',
  })
  lastName: string;

  @ApiProperty({
    description: 'Has the patient been contacted?',
  })
  contacted: boolean;

  @ApiProperty({
    description: 'Date when the patient was created',
  })
  created: Date;

  @ApiProperty({
    description: 'Date when the patient was last updated',
  })
  updated: Date;
}

/**
 * DTO for querying a list of patients.
 */
export class QueryPatientsDto {
  @ApiProperty({
    description: 'Filter for patients contacted status',
  })
  @IsBoolean()
  // Query parameters are string by default. We must transform to boolean value
  @Transform((v) => {
    return v?.obj?.contacted === 'true';
  })
  contacted: boolean;
}

/**
 * DTO for all details for a patient.
 * This is an extension of the ListPatientDto.
 */
export class DetailedPatientDto extends ListPatientDto {
  @ApiProperty({
    description: 'Social security number of the patient',
  })
  ssn: string;

  @ApiProperty({
    description: 'The gender of the patient',
  })
  gender: GenderDto;
}

/**
 * DTO for updating a patient. Note that some properties are excluded.
 * Errors will be thrown if excluded properties are sent to the api.
 * This ensures that only allowed properties are updated.
 */
export class UpdatePatientDto implements Partial<DetailedPatientDto> {
  @Exclude()
  id?: never;

  @ApiPropertyOptional({
    description: 'First name of the patient',
    example: ['John'],
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the patient',
    example: ['Doe'],
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Exclude()
  ssn?: never;

  @Exclude()
  gender?: never;

  @ApiPropertyOptional({
    description: 'Has the patient been contacted?',
  })
  @IsOptional()
  @IsBoolean()
  contacted?: boolean;

  @Exclude()
  created?: never;

  @Exclude()
  updated?: never;
}
