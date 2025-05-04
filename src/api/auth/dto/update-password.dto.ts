import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: 'Old password',
    example: 'Ali007!R',
  })
  @IsString()
  @IsNotEmpty() 
  old_password: string;

  @ApiProperty({
    type: String,
    description: 'New password',
    example: 'Ali007!Rr',
  })
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty() 
  password: string;
}
