import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Skills } from 'src/skills/entities/skill.entity';
import { SkillsModule } from 'src/skills/skills.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([Users,Skills]),
  forwardRef(()=> SkillsModule)],
  exports: [AuthService],
})
export class AuthModule {}
