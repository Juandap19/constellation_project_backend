import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activitty.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';


@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.student)
  async findAll() {
    return this.activityService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.student)
  async findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  // teacher
  @Post()
  @Auth(ValidRoles.teacher)
  async create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }


  // teacher
  @Patch(':id')
  @Auth(ValidRoles.teacher)
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(id, updateActivityDto);
  }

  // teacher
  @Delete(':id')
  @Auth(ValidRoles.teacher)
  async remove(@Param('id') id: string) {
    return this.activityService.remove(id);
  }
}
