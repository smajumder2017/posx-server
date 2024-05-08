import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LicenseService } from '../services/license.service';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtPayload } from 'src/auth/interfaces';

@Controller('license')
export class LicenseController {
  constructor(
    private readonly licenseService: LicenseService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/validate')
  async validate(
    @Body() license: { email?: string; password?: string; number: string },
  ) {
    let accessToken: string;
    if (license.email && license.password) {
      const user = await this.userService.getUserByEmail(license.email);
      if (!user) {
        throw new BadRequestException('User doesnt exists');
      }
      const validPassword = await bcrypt.compare(
        license.password,
        user.password,
      );
      if (!validPassword) {
        throw new BadRequestException('Password Mismached');
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
      accessToken = await this.authService.generateAccessToken(payload);
    }
    const validatedLicense = await this.licenseService.validate(license.number);
    return {
      ...validatedLicense,
      accessToken,
    };
  }
}
