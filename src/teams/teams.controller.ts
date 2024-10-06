import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamsDto } from './dto/create-teams.dto';

@Controller('team')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    async findAll() {
        return this.teamsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.teamsService.findOne(id);
    }

    @Post()
    async create(@Body() createTeamsDto: CreateTeamsDto) {
        return this.teamsService.create(createTeamsDto);
    }

    @Patch(':id')
    async update (
        @Param('id') id: string,
        @Body() updateTeamsDto: CreateTeamsDto
    ) {
        return this.teamsService.update(id, updateTeamsDto);
    }
    
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.teamsService.remove(id);
    }
}
