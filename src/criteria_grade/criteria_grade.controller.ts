import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CriteriaGradeService } from './criteria_grade.service';
import { CreateCriteriaGradeDto } from './dto/create-criteria_grade.dto';
import { UpdateCriteriaGradeDto } from './dto/update-criteria_grade.dto';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';


@Controller('criteria-grade')
export class CriteriaGradeController {
  
  constructor(private readonly criteriaGradeService: CriteriaGradeService) {}

  @Post()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  create(@Body() createCriteriaGradeDto: CreateCriteriaGradeDto) {
    return this.criteriaGradeService.create(createCriteriaGradeDto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findAll() {
    return this.criteriaGradeService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.criteriaGradeService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCriteriaGradeDto: UpdateCriteriaGradeDto) {
    return this.criteriaGradeService.update(id, updateCriteriaGradeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.criteriaGradeService.remove(id);
  }
}
