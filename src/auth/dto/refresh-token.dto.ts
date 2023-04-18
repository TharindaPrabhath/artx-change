import { ApiProperty } from '@nestjs/swagger/dist';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
