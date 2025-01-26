import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtImageDto {
  @ApiProperty({
    type: String,
    description: 'Debt id',
    example: 'd3b2b2b7-1b5e-4c5d-8f4d-2b2b2b7b1e4c',
  })
  debt_id: string;

  @ApiProperty({
    description: 'Put image file',
    example: 'image.png or image.jpeg',
  })
  image: string;
}
