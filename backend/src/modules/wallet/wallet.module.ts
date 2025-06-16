import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule as WalletEntity } from '../../entities/wallet-module.entity';
import { WalletConfig } from '../../entities/wallet-config.entity';
import { WalletModuleService } from './services/wallet-module.service';
import { WalletConfigService } from './services/wallet-config.service';
import { WalletModuleController } from './controllers/wallet-module.controller';
import { WalletConfigController } from './controllers/wallet-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, WalletConfig])],
  controllers: [WalletModuleController, WalletConfigController],
  providers: [WalletModuleService, WalletConfigService],
  exports: [WalletModuleService, WalletConfigService],
})
export class WalletModule {}
