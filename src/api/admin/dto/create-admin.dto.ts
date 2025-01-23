import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { IsPhoneNumber } from 'src/common/decorator/is-phone-number';

export class CreateAdminDto {
  @ApiProperty({
    type: String,
    description: 'Username of admin',
    example: 'Admin001',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    description: 'Password of admin',
    example: 'Admin123',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  hashed_password: string;

  @ApiProperty({
    type: String,
    description: 'Phone number of admin',
    example: '+9989977XXXXXXX',
  })
  @IsPhoneNumber()
  phone_number?: string;
}
