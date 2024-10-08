import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RubricGradeService } from './rubric_grade.service';
import { CreateRubricGradeDto } from './dto/create-rubric_grade.dto';
import { UpdateRubricGradeDto } from './dto/update-rubric_grade.dto';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';


@Controller('rubric-grade')
export class RubricGradeController {
  constructor(private readonly rubricGradeService: RubricGradeService) {}

  @Post()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  create(@Body() createRubricGradeDto: CreateRubricGradeDto) {
    return this.rubricGradeService.create(createRubricGradeDto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findAll() {
    return this.rubricGradeService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rubricGradeService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRubricGradeDto: UpdateRubricGradeDto) {
    return this.rubricGradeService.update(id, updateRubricGradeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rubricGradeService.remove(id);
  }
}
