import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/teams.entity';
import { CreateTeamsDto } from './dto/create-teams.dto';
import { UpdateTeamsDto } from './dto/update-teams.dto';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { forwardRef } from '@nestjs/common';
import { Inject } from '@nestjs/common';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)  private readonly teamsRepository: Repository<Team>, @Inject(forwardRef(() => AuthService))private readonly authService: AuthService
    ) {}

    async findAll() {
        const teams = await this.teamsRepository.find({relations: ['users']});

        return teams;
    }

    async findOne(id: string) {
        const team = await this.teamsRepository.findOne({ where: { id } });
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        return team;
    }


    async addTeamToUser(teamId: string, userId: string) {
        const team = await this.teamsRepository.findOne({ where: { id: teamId } });
        const user = await this.authService.findOne(userId);
        
        if (!team || !user) {
            throw new NotFoundException('Team or user not found');
        }
        user.teams = [...user.teams, team];
        
        return await this.authService.update(user.id, user);
      }


    async create(team: CreateTeamsDto) {

        const users = await this.authService.findOne(team.users);
        const newTeam = Object.assign({ ...team, id: uuid(), users });
        return await this.teamsRepository.save(newTeam);
    }

    async update(id: string, updateTeamsDto: UpdateTeamsDto) {
        const team = await this.findOne(id);
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        const updatedTeam = Object.assign(team, updateTeamsDto);
        return await this.teamsRepository.save(updatedTeam);
        
    }

    async remove(id: string) {
        const team = await this.findOne(id);
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        await this.teamsRepository.delete(id);
    }
}
