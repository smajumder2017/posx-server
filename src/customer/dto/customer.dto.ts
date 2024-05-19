import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Customer } from '@prisma/client';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

interface ICustomer extends Customer {}

export class UpserCustomerDto
  implements Omit<ICustomer, 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  contactNo: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum($Enums.Gender)
  gender: $Enums.Gender;

  @ApiProperty()
  @IsString()
  @IsOptional()
  dob: Date;
}

export class CustomerResponseDto implements Customer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contactNo: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  gender: $Enums.Gender;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
