import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateWalletDto, EditWalletDto } from './dto';

@Injectable()
export class WalletService {
  constructor(private db: DbService) {}

  async getWallet(walletId: string) {
    const wallet = await this.db.wallet.findUnique({ where: { id: walletId }, include: { transactions: true } });
    return wallet;
  }

  async getWallets() {
    const wallets = await this.db.wallet.findMany();
    return wallets;
  }

  async createWallet(userId: string, dto: CreateWalletDto) {
    const wallet = await this.db.wallet.create({ data: { ...dto, userId } });
    return wallet;
  }

  async editWallet(walletId: string, dto: EditWalletDto) {
    const wallet = await this.db.wallet.update({ where: { id: walletId }, data: dto });
    return wallet;
  }

  async deleteWallet(walletId: string) {
    await this.db.wallet.delete({ where: { id: walletId } });
  }
}
