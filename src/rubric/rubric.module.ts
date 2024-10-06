import { Module } from '@nestjs/common';
import { RubricService } from './rubric.service';
import { RubricController } from './rubric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rubric } from './entities/rubric.entity';
import { Criteria } from 'src/criteria/entities/criteria.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { ActivityModule } from 'src/activity/activity.module';

@Module({

  imports: [TypeOrmModule.forFeature([Rubric, Criteria, Activity]), ActivityModule], 
  controllers: [RubricController],
  providers: [RubricService],
  exports: [RubricService],
})
export class RubricModule {}
