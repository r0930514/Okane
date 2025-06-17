import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { WalletModuleService } from '../services/wallet-module.service';
import { CreateWalletModuleDto } from '../dto/create-wallet-module.dto';
import { UpdateWalletModuleDto } from '../dto/update-wallet-module.dto';
import { JwtAuthGuard } from '../../auth/stratgies/jwt-auth.guard';

@ApiTags('wallet-modules')
@Controller('wallet-modules')
export class WalletModuleController {
  constructor(private readonly walletModuleService: WalletModuleService) {}

  @ApiOperation({ summary: '建立新錢包模組' })
  @ApiBody({ type: CreateWalletModuleDto })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: '錢包模組建立成功',
  })
  @ApiResponse({ status: 400, description: '請求資料格式錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWalletModuleDto: CreateWalletModuleDto) {
    return this.walletModuleService.create(createWalletModuleDto);
  }

  @Get()
  @ApiOperation({ summary: '取得所有錢包模組' })
  @ApiResponse({ status: 200, description: '成功取得錢包模組列表' })
  @ApiResponse({ status: 401, description: '未授權' })
  findAll() {
    return this.walletModuleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '取得特定錢包模組' })
  @ApiParam({ name: 'id', description: '錢包模組 ID' })
  @ApiResponse({ status: 200, description: '成功取得錢包模組資訊' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包模組不存在' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.walletModuleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新錢包模組' })
  @ApiParam({ name: 'id', description: '錢包模組 ID' })
  @ApiResponse({ status: 200, description: '錢包模組更新成功' })
  @ApiResponse({ status: 400, description: '請求資料格式錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包模組不存在' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWalletModuleDto: UpdateWalletModuleDto,
  ) {
    return this.walletModuleService.update(id, updateWalletModuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除錢包模組' })
  @ApiParam({ name: 'id', description: '錢包模組 ID' })
  @ApiResponse({ status: 200, description: '錢包模組刪除成功' })
  @ApiResponse({ status: 401, description: '未授權' })
  @ApiResponse({ status: 404, description: '錢包模組不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.walletModuleService.remove(id);
  }
}
