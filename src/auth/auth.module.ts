import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Skills } from 'src/skills/entities/skill.entity';
import { SkillsModule } from 'src/skills/skills.module';
import { Team } from 'src/teams/entities/teams.entity';
import { TeamsModule } from 'src/teams/teams.module';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtModule],
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule,
    forwardRef(() => SkillsModule),
    forwardRef(() => TeamsModule),
    forwardRef(() => CoursesModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') }
      })
    })
  ],
})
export class AuthModule {}
