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
import { Users } from 'src/auth/entities/user.entity';

@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>, @Inject(forwardRef(() => AuthService))private readonly authService: AuthService,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>
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
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const courseUpdate = await this.findOne(id);

    if (!courseUpdate) {
      throw new NotFoundException(`Course with id ${id} not found`);
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

  async createGroups(courseId: string) {    
    const course = await this.findOne(courseId);
  
    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }

    const usersInCourse = await this.usersRepository.find({
      where: {
        courses: {
          id: courseId
        }
      },
      relations: ['courses', 'skills', 'schedules']  
    });

    if (!usersInCourse || usersInCourse.length === 0) {
      throw new NotFoundException(`No users found for course with id ${courseId}`);
    }

    // Crear un mapa para agrupar estudiantes por horarios coincidentes
    const groupedBySchedule = new Map();

    // Mantener un conjunto de estudiantes ya asignados a equipos
    const assignedStudents = new Set();

    // Agrupar estudiantes por day, hour_i y hour_f
    usersInCourse.forEach(user => {
      user.schedules.forEach(schedule => {
        const key = `${schedule.day}-${schedule.hour_i}-${schedule.hour_f}`;
        
        if (!groupedBySchedule.has(key)) {
          groupedBySchedule.set(key, []);
        }

        groupedBySchedule.get(key).push(user);
      });
    });

    const teams = [];

    // Ahora que tenemos los estudiantes agrupados por horarios coincidentes, formamos los equipos
    groupedBySchedule.forEach((students, scheduleKey) => {
      let team = [];
      const usedSkills = new Set();

      students.forEach(student => {
        // Verificar si el estudiante ya fue asignado a un equipo
        if (assignedStudents.has(student.id)) {
          return; // Saltar este estudiante ya que ya está en un equipo
        }

        const studentSkills = student.skills.map(skill => skill.name);

        // Verificamos que el estudiante tenga habilidades diferentes dentro del equipo
        const hasUniqueSkills = studentSkills.every(skill => !usedSkills.has(skill));

        if (hasUniqueSkills) {
          team.push(student);
          studentSkills.forEach(skill => usedSkills.add(skill)); // Añadimos las habilidades al conjunto

          // Marcar al estudiante como asignado a un equipo
          assignedStudents.add(student.id);

          // Limitar el tamaño del equipo a 3 estudiantes
          if (team.length === 3) {
            return; // Salir del bucle si el equipo ya tiene 3 estudiantes
          }
        }
      });

      // Verificar si el equipo es válido (mínimo 1 estudiante, máximo 3)
      if (team.length >= 1 && team.length <= 3) {
        teams.push(team); // Añadimos el equipo
      }
    });

    // Verificar si algunos estudiantes no fueron asignados
    const unassignedStudents = [];

    usersInCourse.forEach(student => {
      if (!assignedStudents.has(student.id)) {
        // Agregar a la lista de no asignados
        unassignedStudents.push(student);
      }
    });

    // Agrupar los no asignados en equipos de hasta 3 estudiantes
    while (unassignedStudents.length > 0) {
      const team = unassignedStudents.splice(0, 3); // Tomar hasta 3 estudiantes
      teams.push(team);
    }

    console.log('Teams:', teams);

    return teams;
  }

}
