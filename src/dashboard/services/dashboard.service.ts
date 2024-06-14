import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/services/prisma.service';
import { Payment } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  private getTotalPayments(payments: Payment[], paymentMode: string) {
    const value = payments
      .filter((payment) => payment.paymentMode === paymentMode)
      .reduce((acc, { amountRecieved }) => {
        acc += amountRecieved;
        return acc;
      }, 0);
    return value;
  }

  async getSalesData(shopId: string) {
    const curr = new Date(); // get current date
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week

    const firstday = new Date(curr.setDate(first)).toUTCString();
    const lastday = new Date(moment(firstday).add(6, 'd')).toUTCString();
    console.log(firstday, lastday);
    const bills = await this.prismaService.billing.findMany({
      where: {
        createdAt: {
          lte: new Date(moment(lastday).add(1, 'd').format('YYYY-MM-DD')),
          gte: new Date(moment(firstday).format('YYYY-MM-DD')),
        },
        isActive: true,
        isSetteled: true,
        shopId,
      },
      include: {
        payments: true,
      },
    });

    const series: Array<{
      [key: string]: {
        total: number;
        cash: number;
        upi: number;
        debitCard: number;
        creditCard: number;
      };
    }> = Array.from(Array(7))
      .map((_, index) => {
        return moment(lastday)
          .subtract(index.toString(), 'd')
          .format('DD/MM/YYYY');
      })
      .reverse()
      .reduce((acc, curr) => {
        acc[curr] = {
          total: 0,
          cash: 0,
          upi: 0,
          debitCard: 0,
          creditCard: 0,
        };
        return acc;
      }, {});

    const salesByDate = bills.reduce(
      (result, { createdAt, totalAmount, payments }) => {
        const date: string = moment(createdAt).format('DD/MM/YYYY');
        const total = (result[date]?.total || 0) + totalAmount;
        const cash =
          (result[date]?.cash || 0) + this.getTotalPayments(payments, 'Cash');
        const upi =
          (result[date]?.upi || 0) + this.getTotalPayments(payments, 'UPI');
        const debitCard =
          (result[date]?.debitCard || 0) +
          this.getTotalPayments(payments, 'DebitCard');
        const creditCard =
          (result[date]?.creditCard || 0) +
          this.getTotalPayments(payments, 'CreditCard');
        result[date] = { total, cash, upi, debitCard, creditCard };
        return result;
      },
      series,
    );

    return { salesByDate };
  }

  async getSalesDataByRange(
    shopId: string,
    range: { startDate: string; endDate: string },
  ) {
    // const curr = new Date(); // get current date
    // const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week

    const firstday = new Date(moment(range.startDate).format('YYYY-MM-DD'));
    const lastday = new Date(moment(range.endDate).format('YYYY-MM-DD'));
    console.log(firstday, lastday);
    const bills = await this.prismaService.billing.findMany({
      where: {
        createdAt: {
          lte: lastday,
          gte: firstday,
        },
        isActive: true,
        isSetteled: true,
        shopId,
      },
      include: {
        payments: true,
      },
    });

    const currentDate = moment(range.startDate)
      .startOf('isoWeek')
      .subtract(1, 'd');

    const startDate = new Date(
      currentDate.clone().startOf('isoWeek').toString(),
    );
    const endDate = new Date(currentDate.clone().endOf('isoWeek').toString());

    const lastWeekBills = await this.prismaService.billing.findMany({
      where: {
        createdAt: {
          lte: endDate,
          gte: startDate,
        },
        isActive: true,
        isSetteled: true,
        shopId,
      },
      include: {
        payments: true,
      },
    });

    const lastPeriodTotalSales = lastWeekBills.reduce((acc, curr) => {
      return acc + curr.totalAmount;
    }, 0);

    const series: Array<{
      [key: string]: {
        total: number;
        cash: number;
        upi: number;
        debitCard: number;
        creditCard: number;
      };
    }> = Array.from(Array(7))
      .map((_, index) => {
        return moment(lastday)
          .subtract(index.toString(), 'd')
          .format('DD/MM/YYYY');
      })
      .reverse()
      .reduce((acc, curr) => {
        acc[curr] = {
          total: 0,
          cash: 0,
          upi: 0,
          debitCard: 0,
          creditCard: 0,
        };
        return acc;
      }, {});

    const salesByDate = bills.reduce(
      (result, { createdAt, totalAmount, payments }) => {
        const date: string = moment(createdAt).format('DD/MM/YYYY');
        const total = (result[date]?.total || 0) + totalAmount;
        const cash =
          (result[date]?.cash || 0) + this.getTotalPayments(payments, 'Cash');
        const upi =
          (result[date]?.upi || 0) + this.getTotalPayments(payments, 'UPI');
        const debitCard =
          (result[date]?.debitCard || 0) +
          this.getTotalPayments(payments, 'DebitCard');
        const creditCard =
          (result[date]?.creditCard || 0) +
          this.getTotalPayments(payments, 'CreditCard');
        result[date] = { total, cash, upi, debitCard, creditCard };
        return result;
      },
      series,
    );

    return { salesByDate, lastPeriodTotalSales };
  }
}
