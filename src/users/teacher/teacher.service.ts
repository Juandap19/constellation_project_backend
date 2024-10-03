import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Teacher } from './entities/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherService {

  constructor(
    @InjectRepository(Teacher) private readonly teacherRepository: Repository<Teacher>
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    const newTeacher = Object.assign({...createTeacherDto, id: uuid()});
    return this.teacherRepository.save(newTeacher);
    
  }

  findAll() {
    return `This action returns all teacher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
