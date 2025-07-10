import { IsOptional, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class NotificationPreferences {
  @IsOptional()
  email?: boolean;

  @IsOptional()
  push?: boolean;
}

class UserPreferences {
  @IsOptional()
  language?: string;

  @IsOptional()
  timezone?: string;

  @IsOptional()
  theme?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPreferences)
  notifications?: NotificationPreferences;
}

export class UpdateUserPreferencesDto {
  @ApiProperty({
    description: '用戶偏好設定',
    example: {
      language: 'zh-TW',
      timezone: 'Asia/Taipei',
      theme: 'light',
      notifications: {
        email: true,
        push: false,
      },
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => UserPreferences)
  preferences: UserPreferences;
}
