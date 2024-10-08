import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';


@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
