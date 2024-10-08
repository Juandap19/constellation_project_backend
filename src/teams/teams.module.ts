import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/teams.entity';
import { AuthModule } from '../auth/auth.module';
import { forwardRef } from '@nestjs/common';
import { Users } from '../auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Team,Users, PassportModule]),
  forwardRef(() => AuthModule)
],
 exports: [TeamsService],
 
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}
