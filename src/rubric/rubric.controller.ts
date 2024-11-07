import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RubricService } from './rubric.service';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { UpdateRubricDto } from './dto/update-rubric.dto';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('rubric')
export class RubricController {
  constructor(private readonly rubricService: RubricService) {}

  // teacher
  @Post()
  @Auth(ValidRoles.teacher)
  create(@Body() createRubricDto: CreateRubricDto) {
    return this.rubricService.create(createRubricDto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findAll() {
    return this.rubricService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rubricService.findOne(id);
  }

  // teacher
  @Patch(':id')
  @Auth(ValidRoles.teacher)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRubricDto: UpdateRubricDto) {
    return this.rubricService.update(id, updateRubricDto);
  }

  // teacher
  @Delete(':id')
  @Auth(ValidRoles.teacher)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.rubricService.remove(id);
  }

  @Get('activity/:activityId')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findByActivity(@Param('activityId', ParseUUIDPipe) activityId: string) {
    return this.rubricService.findByActivity(activityId);
  }
}
