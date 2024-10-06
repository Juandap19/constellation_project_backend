import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/teams.entity';
import { CreateTeamsDto } from './dto/create-teams.dto';
import { UpdateTeamsDto } from './dto/update-teams.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private readonly teamsRepository: Repository<Team>
    ) {}

    async findAll() {
        const teams = await this.teamsRepository.find();

        return teams;
    }

    async findOne(id: string) {
        const team = await this.teamsRepository.findOne({ where: { id } });
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        return team;
    }

    async create(createTeamsDto: CreateTeamsDto) {
        const newTeam = Object.assign({ ...createTeamsDto, id: uuid() });
        return await this.teamsRepository.save(newTeam);
    }

    async update(id: string, updateTeamsDto: UpdateTeamsDto) {
        const team = await this.findOne(id);
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        await this.teamsRepository.update(id, updateTeamsDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        const team = await this.findOne(id);
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        await this.teamsRepository.delete(id);
    }
}
