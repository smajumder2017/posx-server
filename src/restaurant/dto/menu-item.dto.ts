import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  @IsNotEmpty()
  availability: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  foodType: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  waitingTime?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  spiceScale: string;

  @ApiProperty({ isArray: true, required: false })
  @IsOptional()
  servingTime?: string[];

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  itemImageUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remoteImageId: string;

  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  shopId: string;
}

export class UpdateMenuItemDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  itemName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  foodType?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  waitingTime?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  spiceScale?: string;

  @ApiProperty({ isArray: true, required: false })
  @IsOptional()
  servingTime?: string[];

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  itemImageUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remoteImageId?: string;

  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  shopId: string;
}
