import { Module } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { CriteriaController } from './criteria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricModule } from 'src/rubric/rubric.module';
import { Criteria } from './entities/criteria.entity';
import { Rubric } from 'src/rubric/entities/rubric.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Criteria, Rubric]),
    RubricModule,  PassportModule.register({ defaultStrategy: 'jwt' }), 
    AuthModule

  ],
  controllers: [CriteriaController],
  providers: [CriteriaService],
  exports: [CriteriaService]
  
})
export class CriteriaModule {}
