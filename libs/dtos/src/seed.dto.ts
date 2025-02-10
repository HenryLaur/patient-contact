import { ApiProperty } from '@nestjs/swagger';

export class SeedResponseDto {
  @ApiProperty({
    description: 'Indicates if the seeding was successful',
  })
  success: boolean;
}
