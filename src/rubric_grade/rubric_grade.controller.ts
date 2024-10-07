import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RubricGradeService } from './rubric_grade.service';
import { CreateRubricGradeDto } from './dto/create-rubric_grade.dto';
import { UpdateRubricGradeDto } from './dto/update-rubric_grade.dto';

@Controller('rubric-grade')
export class RubricGradeController {
  constructor(private readonly rubricGradeService: RubricGradeService) {}

  @Post()
  create(@Body() createRubricGradeDto: CreateRubricGradeDto) {
    return this.rubricGradeService.create(createRubricGradeDto);
  }

  @Get()
  findAll() {
    return this.rubricGradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rubricGradeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRubricGradeDto: UpdateRubricGradeDto) {
    return this.rubricGradeService.update(id, updateRubricGradeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rubricGradeService.remove(id);
  }
}
