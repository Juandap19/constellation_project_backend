import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamsDto } from './dto/create-teams.dto';
import { UpdateTeamsDto } from './dto/update-teams.dto';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('team')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    @Auth(ValidRoles.teacher, ValidRoles.student)
    async findAll() {
        return this.teamsService.findAll();
    }

    @Get(':id')
    @Auth(ValidRoles.teacher, ValidRoles.student)
    async findOne(@Param('id') id: string) {
        return this.teamsService.findOne(id);
    }


    // teacher
    @Post()
    @Auth(ValidRoles.teacher)
    async create(@Body() createTeamsDto: CreateTeamsDto) {
        return this.teamsService.create(createTeamsDto);
    }


     // teacher
    @Patch(':id')
    @Auth(ValidRoles.teacher)
    async update (
        @Param('id') id: string,
        @Body() updateTeamsDto: UpdateTeamsDto
    ) {
        return this.teamsService.update(id, updateTeamsDto);
    }
    

     // teacher
    @Delete(':id')
    @Auth(ValidRoles.teacher)
    async remove(@Param('id') id: string) {
        return this.teamsService.remove(id);
    }
    

    // teacher
    @Post(':teamId/user/:userId')
    @Auth(ValidRoles.teacher)
  addTeamToUser(@Param('teamId') teamId: string, @Param('userId') userId: string) {
    return this.teamsService.addTeamToUser(teamId, userId);
  }
}
