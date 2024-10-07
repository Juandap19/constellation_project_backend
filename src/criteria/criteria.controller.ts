import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { CreateCriteriaDto } from './dto/create-criteria.dto';
import { UpdateCriteriaDto } from './dto/update-criteria.dto';
import { Criteria } from './entities/criteria.entity';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('criteria')
export class CriteriaController {
  constructor(private readonly criteriaService: CriteriaService) {}

  // teacher
  @Post()
  @Auth(ValidRoles.teacher)
  create(@Body() criteria: CreateCriteriaDto) {
    return this.criteriaService.create(criteria);
  }

  @Get()
  findAll() {
    return this.criteriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.criteriaService.findOne(id);
  }

  // teacher
  @Patch(':id')
  @Auth(ValidRoles.teacher)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCriteriaDto: CreateCriteriaDto) {
    return this.criteriaService.update(id, updateCriteriaDto);
  }

  // teacher
  @Delete(':id')
  @Auth(ValidRoles.teacher)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.criteriaService.remove(id);
  }
}
