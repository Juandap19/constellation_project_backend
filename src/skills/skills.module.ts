import { forwardRef, Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skills } from './entities/skill.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from 'src/auth/entities/user.entity';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService],
  imports: [TypeOrmModule.forFeature([Skills,Users]),forwardRef(()=> AuthModule)],
  exports: [SkillsService],
})
export class SkillsModule {}
