import { Module } from '@nestjs/common';
import { CriteriaGradeService } from './criteria_grade.service';
import { CriteriaGradeController } from './criteria_grade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Criteria } from 'src/criteria/entities/criteria.entity';
import { CriteriaModule } from 'src/criteria/criteria.module';
import { CriteriaGrade } from './entities/criteria_grade.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriteriaGrade]),
    CriteriaModule, AuthModule
  ],
  controllers: [CriteriaGradeController],
  providers: [CriteriaGradeService],
  exports: [CriteriaGradeService]
})
export class CriteriaGradeModule {}
