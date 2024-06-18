import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtPayload } from 'src/auth/interfaces';
import { ShopService } from '../services/shop.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  CreateShopDto,
  UpdateShopDto,
  UpsertShopConfigDto,
} from '../dto/shop.dto';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from 'src/auth/services/auth.service';
import { LicenseService } from 'src/license/services/license.service';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly licenseService: LicenseService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Post()
  async create(
    @Body() createShopDto: CreateShopDto,
    @GetUser() user: JwtPayload,
  ) {
    await this.shopService.createShop(user.id, {
      ...createShopDto,
    });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @Put()
  async update(@Body() updateShopDto: UpdateShopDto) {
    await this.shopService.updateShop(updateShopDto);
    return;
  }

  @Get('type')
  @UseGuards(JwtAuthGuard)
  async getAllShopType(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('lastSyncTime') lastSyncTime?: string,
  ) {
    const findConditions: Prisma.ShopTypeWhereInput = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }

    const count = await this.shopService.getShopTypeCount({
      where: findConditions,
    });
    const shopTypes = await this.shopService.findAllShopTypes({
      where: findConditions,
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return {
      shopTypes,
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async getAllShops(@GetUser() user: JwtPayload) {
    return this.shopService.getAllUserShop({
      where: { userId: user.id },
      include: { shop: { include: { shopType: true } } },
    });
  }

  @Get(':shopId')
  @UseGuards(JwtAuthGuard)
  async getShopDetails(@Param('shopId') shopId: string) {
    return this.shopService.getShopById(shopId);
  }

  @Get(':shopId/details')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async getShopDetailsAdmin(@Param('shopId') shopId: string) {
    return this.shopService.getShopByIdwithType(shopId);
  }

  @Get(':shopId/users')
  @UseGuards(JwtAuthGuard)
  async getAllShopUsers(
    @Param('shopId') shopId: string,
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    const findConditions: Prisma.UserShopWhereInput = { shopId };
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }
    console.log(findConditions);
    const count = await this.shopService.getShopUserCount({
      where: findConditions,
    });
    const userShops = await this.shopService.findAllShopUsers({
      where: findConditions,
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return {
      userShops,
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('token')
  async generateShopToken(
    @Body() shopTokenDto: { license: string; userId: string },
  ) {
    const user = await this.userService.getUserById(shopTokenDto.userId);
    if (!user && user.userRoles.find((ur) => ur.role.value === 'OWNER')) {
      throw new BadRequestException('User doesnt exists');
    }

    const license = await this.licenseService.validate(shopTokenDto.license);

    if (!license.valid) {
      throw new BadRequestException('Not a valid license');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      isActive: user.isActive,
      userShops: user.userShops,
      userRoles: user.userRoles,
      contactNo: user.contactNo,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const accessToken = await this.authService.generateAccessToken(payload);

    return {
      accessToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async patchShopConfig(@Body() shopConfig: UpsertShopConfigDto) {
    const { config } = shopConfig;
    return this.shopService.upsertShopConfig({
      ...shopConfig,
      config: config as unknown as Prisma.JsonObject,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('config/:shopId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async getShopConfig(@Param('shopId') shopId: string) {
    return this.shopService.getShopConfig(shopId);
  }
}
