import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletModuleDto } from './create-wallet-module.dto';

export class UpdateWalletModuleDto extends PartialType(CreateWalletModuleDto) {}
