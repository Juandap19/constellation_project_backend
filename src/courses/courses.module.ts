import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from 'src/auth/entities/user.entity';
import { Team } from 'src/teams/entities/teams.entity';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [TypeOrmModule.forFeature([Course,Users, Team]), forwardRef(() => AuthModule),
  TeamsModule
],
  exports: [CoursesService],
})
export class CoursesModule {}
