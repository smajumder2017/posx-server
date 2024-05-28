import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsPhoneNumber,
  IsLatitude,
  IsLongitude,
  IsInt,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateShopDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  registrationNo: string;

  @ApiProperty({ required: true })
  @IsInt()
  shopTypeId: number;

  @ApiProperty({ required: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: true })
  @IsString()
  @IsPhoneNumber()
  contactNo: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  pincode: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsLatitude()
  latitude: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsLongitude()
  longitude: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gstinNo?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  cgstPercentage?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  sgstPercentage?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  serviceChargePercentage?: number;
}
