import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletConfigDto } from './create-wallet-config.dto';

export class UpdateWalletConfigDto extends PartialType(CreateWalletConfigDto) {}
