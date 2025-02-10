import { ApiProperty } from '@nestjs/swagger';

// We know, this is not the full gender spectrum, but it supports our seeding library.
export type GenderNameType = 'male' | 'female';

export class GenderDto {
  @ApiProperty({
    description: 'Unique identifier for the gender',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the gender',
  })
  name: GenderNameType;
}
