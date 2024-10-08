import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { AuthModule } from '../auth/auth.module';
import { Users } from  '../auth/entities/user.entity';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [TypeOrmModule.forFeature([Schedule,Users]),
 AuthModule],
})
export class ScheduleModule {}
