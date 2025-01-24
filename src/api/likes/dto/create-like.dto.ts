import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    type: String,
    description: 'The ID of the store',
    example: 'f8a3b2f5-d123-4234-98e9-ff6ab9c8f67d',
  })
  @IsUUID()
  @IsNotEmpty()
  store_id: string;

  @ApiProperty({
    type: String,
    description: 'The ID of the debtor',
    example: 'f8a3b2f5-d123-4234-98e9-ff6ab9c8f67d',
  })
  @IsUUID()
  @IsNotEmpty()
  debtor_id: string;
}
