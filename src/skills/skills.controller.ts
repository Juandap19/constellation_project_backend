import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @Auth(ValidRoles.teacher)
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  // teacher
  @Patch(':id')
  @Auth(ValidRoles.teacher)
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

   // teacher
  @Delete(':id')
  @Auth(ValidRoles.teacher)
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }

   // student 
  @Post(':skillId/user/:userId')
  @Auth(ValidRoles.student)
  addSkillToUser(@Param('skillId') skillId: string, @Param('userId') userId: string) {
    return this.skillsService.addSkillToUser(skillId, userId);
  }
}
