import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { ActivityModule } from './activity/activity.module';
import { Schedule } from './schedule/entities/schedule.entity';
import { ScheduleModule } from './schedule/schedule.module';
import { SkillsModule } from './skills/skills.module';
import { RubricModule } from './rubric/rubric.module';
import { CriteriaModule } from './criteria/criteria.module';
import { TeamsModule } from './teams/teams.module';
import { CriteriaGradeModule } from './criteria_grade/criteria_grade.module';
import { RubricGradeModule } from './rubric_grade/rubric_grade.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: +process.env.DB_PORT,
      autoLoadEntities: true,
      synchronize: true, // solo para desarrollo
      ssl: {
        rejectUnauthorized: false, // Permite conexiones sin verificar el certificado, útil en desarrollo
      },
      logging: false,
    }),
    CoursesModule,
    AuthModule,
    ScheduleModule,
    SkillsModule,
    ActivityModule,
    RubricModule,
    CriteriaModule,
    TeamsModule,
    CriteriaGradeModule,
    RubricGradeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

