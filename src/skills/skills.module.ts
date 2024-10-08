import { forwardRef, Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skills } from './entities/skill.entity';
import { AuthModule } from '../auth/auth.module';
import { Users } from '../auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService],
  imports: [TypeOrmModule.forFeature([Skills,Users]),forwardRef(()=> AuthModule), PassportModule],
  exports: [SkillsService],
})
export class SkillsModule {}
