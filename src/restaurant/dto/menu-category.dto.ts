import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: true })
  @IsUUID()
  shopId: string;
}

export class UpdateCategoryDto {
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryName?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  shopId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  displayIndex?: number;
}
