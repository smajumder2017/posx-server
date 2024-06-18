import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  Transaction,
} from 'src/infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';
import generateLicenseKey from '@mcnaveen/license-gen';
import moment from 'moment';

@Injectable()
export class LicenseService {
  constructor(private readonly prismaService: PrismaService) {}

  createLicense(
    license: Omit<Prisma.LicenseUncheckedCreateInput, 'number'>,
    txn: Transaction = this.prismaService,
  ) {
    return txn.license.create({
      data: { ...license, number: this.generateLicenseNumber() },
    });
  }

  private generateLicenseNumber() {
    return generateLicenseKey(16);
  }

  async validate(number: string) {
    const license = await this.prismaService.license.findUnique({
      where: { number },
    });

    return {
      license,
      valid: license
        ? moment(license.endDate).diff(moment(), 'day') >= 0
        : false,
    };
  }
}
