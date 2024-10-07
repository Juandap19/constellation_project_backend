import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CriteriaGradeService } from './criteria_grade.service';
import { CreateCriteriaGradeDto } from './dto/create-criteria_grade.dto';
import { UpdateCriteriaGradeDto } from './dto/update-criteria_grade.dto';

@Controller('criteria-grade')
export class CriteriaGradeController {
  
  constructor(private readonly criteriaGradeService: CriteriaGradeService) {}

  @Post()
  create(@Body() createCriteriaGradeDto: CreateCriteriaGradeDto) {
    return this.criteriaGradeService.create(createCriteriaGradeDto);
  }

  @Get()
  findAll() {
    return this.criteriaGradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.criteriaGradeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCriteriaGradeDto: UpdateCriteriaGradeDto) {
    return this.criteriaGradeService.update(id, updateCriteriaGradeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.criteriaGradeService.remove(id);
  }
}
