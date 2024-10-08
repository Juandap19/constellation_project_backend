import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Activity } from './entities/activity.entity';
import { CoursesModule } from '../courses/courses.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), CoursesModule , PassportModule,  PassportModule.register({ defaultStrategy: 'jwt' }), // Asegúrate de incluir esto
  AuthModule],
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
