import { Body, Controller, Get, Post, UseGuards, Patch, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { CreateWalletDto } from './dto';
import { GetUser } from 'src/auth/decorator';

@Controller('wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getWallets() {
    return this.walletService.getWallets();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getWallet(@Param('id') walletId: string) {
    return this.walletService.getWallet(walletId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createWallet(@GetUser('id') userId: string, @Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async editWallet(@Param('id') walletId: string, @Body() dto: CreateWalletDto) {
    return this.walletService.editWallet(walletId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  async deleteWallet(@Param('id') walletId: string) {
    return this.walletService.deleteWallet(walletId);
  }
}
