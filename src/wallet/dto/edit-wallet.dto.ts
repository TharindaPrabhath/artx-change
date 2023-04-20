import { IsOptional, IsString } from 'class-validator';

export class EditWalletDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  network: string;

  @IsString()
  @IsOptional()
  currency: string;

  @IsString()
  @IsOptional()
  privateKey: string;

  @IsString()
  @IsOptional()
  cert: string;
}
