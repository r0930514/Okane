import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletModule } from '../../../entities/wallet-module.entity';
import { CreateWalletModuleDto } from '../dto/create-wallet-module.dto';
import { UpdateWalletModuleDto } from '../dto/update-wallet-module.dto';

@Injectable()
export class WalletModuleService {
  constructor(
    @InjectRepository(WalletModule)
    private walletModuleRepository: Repository<WalletModule>,
  ) {}

  async create(
    createWalletModuleDto: CreateWalletModuleDto,
  ): Promise<WalletModule> {
    const walletModule = this.walletModuleRepository.create(
      createWalletModuleDto,
    );
    return await this.walletModuleRepository.save(walletModule);
  }

  async findAll(): Promise<WalletModule[]> {
    return await this.walletModuleRepository.find({
      relations: ['walletConfigs'],
    });
  }

  async findOne(id: number): Promise<WalletModule> {
    const walletModule = await this.walletModuleRepository.findOne({
      where: { moduleId: id },
      relations: ['walletConfigs'],
    });

    if (!walletModule) {
      throw new NotFoundException(`錢包模組 ID ${id} 不存在`);
    }

    return walletModule;
  }

  async update(
    id: number,
    updateWalletModuleDto: UpdateWalletModuleDto,
  ): Promise<WalletModule> {
    const walletModule = await this.findOne(id);

    Object.assign(walletModule, updateWalletModuleDto);

    return await this.walletModuleRepository.save(walletModule);
  }

  async remove(id: number): Promise<void> {
    const walletModule = await this.findOne(id);
    await this.walletModuleRepository.remove(walletModule);
  }

  async validateConfigFormat(
    moduleId: number,
    configData: object,
  ): Promise<boolean> {
    const walletModule = await this.findOne(moduleId);
    const requiredFormat = walletModule.moduleConfigFormat;

    // 這裡可以實作更複雜的格式驗證邏輯
    // 目前簡單檢查必要欄位是否存在
    if (typeof requiredFormat === 'object' && requiredFormat !== null) {
      const requiredKeys = Object.keys(requiredFormat);
      const providedKeys = Object.keys(configData);

      return requiredKeys.every((key) => providedKeys.includes(key));
    }

    return true;
  }
}
