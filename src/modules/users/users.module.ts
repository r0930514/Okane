import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDefinition } from 'src/models/user.model';

@Module({
  imports: [MongooseModule.forFeature([UserDefinition])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
