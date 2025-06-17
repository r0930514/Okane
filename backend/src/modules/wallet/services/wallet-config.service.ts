import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletConfig } from '../../../entities/wallet-config.entity';
import { CreateWalletConfigDto } from '../dto/create-wallet-config.dto';
import { UpdateWalletConfigDto } from '../dto/update-wallet-config.dto';
import { WalletModuleService } from './wallet-module.service';

@Injectable()
export class WalletConfigService {
  constructor(
    @InjectRepository(WalletConfig)
    private walletConfigRepository: Repository<WalletConfig>,
    private walletModuleService: WalletModuleService,
  ) {}

  async create(
    userId: number,
    createWalletConfigDto: CreateWalletConfigDto,
  ): Promise<WalletConfig> {
    // 驗證模組是否存在
    await this.walletModuleService.findOne(createWalletConfigDto.moduleId);

    // 驗證設定格式是否符合模組要求
    const isValidFormat = await this.walletModuleService.validateConfigFormat(
      createWalletConfigDto.moduleId,
      createWalletConfigDto.moduleConfigData,
    );

    if (!isValidFormat) {
      throw new BadRequestException('設定檔格式不符合模組要求');
    }

    const walletConfig = this.walletConfigRepository.create({
      ...createWalletConfigDto,
      userId,
    });

    return await this.walletConfigRepository.save(walletConfig);
  }

  async findAllByUser(userId: number): Promise<WalletConfig[]> {
    return await this.walletConfigRepository.find({
      where: { userId },
      relations: ['walletModule', 'user'],
    });
  }

  async findOne(id: number, userId: number): Promise<WalletConfig> {
    const walletConfig = await this.walletConfigRepository.findOne({
      where: { configId: id, userId },
      relations: ['walletModule', 'user'],
    });

    if (!walletConfig) {
      throw new NotFoundException(`錢包設定檔 ID ${id} 不存在或無權限存取`);
    }

    return walletConfig;
  }

  async update(
    id: number,
    userId: number,
    updateWalletConfigDto: UpdateWalletConfigDto,
  ): Promise<WalletConfig> {
    const walletConfig = await this.findOne(id, userId);

    // 如果要更新模組ID，需要驗證新模組
    if (updateWalletConfigDto.moduleId) {
      await this.walletModuleService.findOne(updateWalletConfigDto.moduleId);
    }

    // 如果要更新設定資料，需要驗證格式
    if (updateWalletConfigDto.moduleConfigData) {
      const moduleId = updateWalletConfigDto.moduleId || walletConfig.moduleId;
      const isValidFormat = await this.walletModuleService.validateConfigFormat(
        moduleId,
        updateWalletConfigDto.moduleConfigData,
      );

      if (!isValidFormat) {
        throw new BadRequestException('設定檔格式不符合模組要求');
      }
    }

    Object.assign(walletConfig, updateWalletConfigDto);

    return await this.walletConfigRepository.save(walletConfig);
  }

  async remove(id: number, userId: number): Promise<void> {
    const walletConfig = await this.findOne(id, userId);
    await this.walletConfigRepository.remove(walletConfig);
  }

  async findByModule(moduleId: number): Promise<WalletConfig[]> {
    return await this.walletConfigRepository.find({
      where: { moduleId },
      relations: ['user'],
    });
  }
}
