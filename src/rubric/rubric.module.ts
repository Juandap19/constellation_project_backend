import { Module } from '@nestjs/common';
import { RubricService } from './rubric.service';
import { RubricController } from './rubric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rubric } from './entities/rubric.entity';
import { Criteria } from '../criteria/entities/criteria.entity';
import { Activity } from '../activity/entities/activity.entity';
import { ActivityModule } from '../activity/activity.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({

  imports: [TypeOrmModule.forFeature([Rubric, Criteria, Activity]), ActivityModule,  PassportModule.register({ defaultStrategy: 'jwt' }), 
  AuthModule], 
  controllers: [RubricController],
  providers: [RubricService],
  exports: [RubricService],
})
export class RubricModule {}
