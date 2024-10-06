import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>, @Inject(forwardRef(() => AuthService))private readonly authService: AuthService 
  ) {}


  async create(course: CreateCourseDto) {
    const users = await this.authService.findOne(course.users);
    const newCourse = Object.assign({...course, id: uuid(), users});
    return await this.courseRepository.save(newCourse);
  }


  async addCourseToUser(courseId: string, userId: string) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    const user = await this.authService.findOne(userId);
    
    if (!course || !user) {
        throw new NotFoundException('course or user not found');
    }
    console.log("ESTE ES EL USER COURSE ",user.courses);
    user.courses = [...user.courses, course];
    
    return await this.authService.update(user.id, user);
  }

  findAll() {
    return this.courseRepository.find({relations:['activities']});
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({ where: {id} });
    if (!course) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const courseUpdate = await this.findOne(id);

    if (!courseUpdate) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    Object.assign(courseUpdate, updateCourseDto);
    const updatedCourse = this.courseRepository.save(courseUpdate);
    return updatedCourse;
  }

  async remove(id: string) {
    const courseDelete = await this.findOne(id);

    if (!courseDelete) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    const deleteCourse = await this.courseRepository.delete(id);
    return deleteCourse;
  }
}
