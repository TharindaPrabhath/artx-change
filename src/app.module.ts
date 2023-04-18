import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, EmailModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
