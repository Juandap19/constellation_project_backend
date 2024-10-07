import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Auth } from '../auth/decorators/auth.decorator'; 
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // teacher
  @Post()
  @Auth(ValidRoles.teacher)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }


  // teacher
  @Patch(':id')
  @Auth(ValidRoles.teacher)
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  // teacher
  @Delete(':id')
  @Auth(ValidRoles.teacher)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  // teacher
  @Post(':courseId/user/:userId')
  @Auth(ValidRoles.teacher)
  addCourseToUser(@Param('courseId') courseId: string, @Param('userId') userId: string) {
    return this.coursesService.addCourseToUser(courseId, userId);
  }

  // teacher
  @Post('teams/:courseId')
  @Auth(ValidRoles.teacher)
  createGroups(@Param('courseId') courseId: string) {
    return this.coursesService.createGroups(courseId);
     
  }

}
