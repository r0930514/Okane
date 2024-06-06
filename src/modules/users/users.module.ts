import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDefinition } from 'src/models/user.model';

@Module({
  imports: [MongooseModule.forFeature([UserDefinition])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
