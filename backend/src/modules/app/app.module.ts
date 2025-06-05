import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfigFactory from 'src/config/database.config';
import JwtConfigFactory from 'src/config/jwt.config';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { User } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [DatabaseConfigFactory, JwtConfigFactory],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [User, Wallet, Transaction],
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
