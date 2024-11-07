import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Users } from '../auth/entities/user.entity';
import { Team } from '../teams/entities/teams.entity';
import { TeamsService } from '../teams/teams.service';


@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>, @Inject(forwardRef(() => AuthService))private readonly authService: AuthService,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Team) private readonly teamsRepositoy: Repository<Team>,
    private readonly teamService: TeamsService
  ) {}

  async create(course: CreateCourseDto) {
    const users = await Promise.all(course.users.map(userId => this.authService.findOne(userId)));
    const newCourse = Object.assign({...course, id: uuid(), users});
    return await this.courseRepository.save(newCourse);
  }

  async addCourseToUser(courseId: string, userId: string) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    const user = await this.authService.findOne(userId);

    // console.log("CURSO Y ESTUDIANTE" + course, user);
    
    if (!course || !user) {
        throw new NotFoundException('course or user not found');
    }
    user.courses = [...user.courses, course];
    
    return await this.authService.update(user.id, user);
  }

  findAll() {
    return this.courseRepository.find({relations:['activities']});
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({ where: {id}, relations:['activities'] });
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
    // Generar los grupos automáticamente
    const thegroups = await this.generateAutomaticGroups(courseId);
    
    // Crear un nuevo array donde cada grupo tendrá un nombre asignado
    const groupsWithNames = thegroups.map((group, index) => {
      return { 
        name: `auto${index + 1}`,  // Asignar un nombre único
        array: group               // Mantener el grupo original
      };
    });
  
    // Imprimir cada grupo con su nombre
    groupsWithNames.forEach(group => {
    });
  
  
    // Crear los equipos en la base de datos
    for (const element of groupsWithNames) {
      const newTeam = Object.assign({
        id: uuid(),
        name: element.name,       // Nombre del equipo
        course: courseId        // ID del curso
      });
  
      await this.teamsRepositoy.save(newTeam);  // Guardar el equipo en la base de datos

      element.array.forEach(element2 => {
        this.teamService.addTeamToUser(newTeam.id, element2.id)
      });
    }

  
  
    return groupsWithNames;
  }
  
  

  async generateAutomaticGroups(courseId: string): Promise<Users[][]> {
    
    const course = await this.findOne(courseId);

    if (!course) {
      throw new NotFoundException(`Course with id ${courseId} not found`);
    }

    // Buscar todos los usuarios en el curso con rol 'student' y sus relaciones
    const usersInCourse: Users[] = await this.usersRepository.find({
      where: {
        courses: {
          id: courseId,
        },
        role: 'student', // Filtrar solo a los estudiantes
      },
      relations: ['courses', 'skills', 'schedules'],
    });

    if (!usersInCourse || usersInCourse.length === 0) {
      throw new NotFoundException(`No users found for course with id ${courseId}`);
    }

    // Eliminar duplicados de usuarios (si existe)
    const uniqueUsersMap = new Map<string, Users>();
    usersInCourse.forEach((user) => {
      if (!uniqueUsersMap.has(user.id)) {
        uniqueUsersMap.set(user.id, user);
      }
    });
    const uniqueUsers = Array.from(uniqueUsersMap.values());

    // Crear un mapa para agrupar estudiantes por horarios coincidentes
    const groupedBySchedule: Map<string, Users[]> = new Map<string, Users[]>();

    // Agrupar estudiantes por day, hour_i y hour_f
    uniqueUsers.forEach((user) => {
      // Crear un Set de claves de horarios para eliminar duplicados por estudiante
      const scheduleKeys = new Set(
        user.schedules.map((schedule) => `${schedule.day}-${schedule.hour_i}-${schedule.hour_f}`)
      );

      scheduleKeys.forEach((key) => {
        if (!groupedBySchedule.has(key)) {
          groupedBySchedule.set(key, []);
        }
        groupedBySchedule.get(key)!.push(user); // Usar el operador de aserción no nula
      });
    });

    const teams: Users[][] = [];
    const assignedStudents: Set<string> = new Set<string>();

    
    const createTeamsFromGroup = (students: Users[]) => {
      // Eliminar duplicados dentro del mismo grupo de horarios
      const uniqueStudents = Array.from(
        new Map(students.map((student) => [student.id, student])).values()
      );

      // Filtrar estudiantes que aún no han sido asignados
      const unassigned = uniqueStudents.filter((student) => !assignedStudents.has(student.id));
      const totalUnassigned = unassigned.length;

      if (totalUnassigned === 0) return;

      // Caso especial: Si hay exactamente 3 estudiantes, agruparlos juntos
      if (totalUnassigned === 3) {
        teams.push(unassigned);
        unassigned.forEach((student) => assignedStudents.add(student.id));
        return;
      }

      // Crear un mapa para agrupar estudiantes por habilidades
      const skillMap: Map<string, Users[]> = new Map<string, Users[]>();

      unassigned.forEach((student) => {
        student.skills.forEach((skill) => {
          if (!skillMap.has(skill.name)) {
            skillMap.set(skill.name, []);
          }
          skillMap.get(skill.name)!.push(student);
        });
      });

      // Mientras haya al menos dos habilidades diferentes disponibles
      while (skillMap.size >= 2) {
        const team: Users[] = [];
        const usedSkills: Set<string> = new Set<string>();

        // Seleccionar un estudiante de cada habilidad
        for (let [skill, studentsWithSkill] of skillMap) {
          if (usedSkills.size >= 2) break;
          const student = studentsWithSkill.shift();
          if (student) {
            team.push(student);
            usedSkills.add(skill);
            assignedStudents.add(student.id);
            // Si ya no hay más estudiantes con esta habilidad, eliminar del mapa
            if (studentsWithSkill.length === 0) {
              skillMap.delete(skill);
            }
          }
        }

        if (team.length >= 2) {
          teams.push(team);
        }
      }

      // Manejar estudiantes restantes
      const remaining = unassigned.filter((student) => !assignedStudents.has(student.id));
      if (remaining.length >= 2) {
        // Agruparlos aunque las habilidades se repitan
        for (let i = 0; i < remaining.length; i += 2) {
          const group = remaining.slice(i, i + 2);
          group.forEach((student) => assignedStudents.add(student.id));
          teams.push(group);
        }
      } else if (remaining.length === 1) {
        teams.push([remaining[0]]);
        assignedStudents.add(remaining[0].id);
      }
    };

    // Crear equipos para cada grupo de horario
    groupedBySchedule.forEach((students, scheduleKey) => {
      createTeamsFromGroup(students);
    });

    // Verificar si algunos estudiantes no fueron asignados (aunque debería estar cubierto)
    const unassignedStudents = uniqueUsers.filter((student) => !assignedStudents.has(student.id));

    // Intentar asignar estudiantes no asignados a equipos existentes, si coinciden en horario
    unassignedStudents.forEach((unassigned) => {
      let added = false;
      for (const team of teams) {
        // Permitir hasta 3 miembros por equipo
        if (team.length < 3 && this.hasMatchingSchedule(team, unassigned)) {
          team.push(unassigned);
          assignedStudents.add(unassigned.id);
          added = true;
          break; // Salir del ciclo una vez asignado
        }
      }

      // Si no pudo ser asignado a un equipo existente, formar un nuevo equipo
      if (!added) {
        teams.push([unassigned]);
        assignedStudents.add(unassigned.id);
      }
    });

    // Asegurarse de que no haya equipos con un solo miembro a menos que sea absolutamente necesario
    const singletonTeams = teams.filter((team) => team.length === 1);
    singletonTeams.forEach((singletonTeam) => {
      const student = singletonTeam[0];
      for (const otherTeam of teams) {
        if (
          otherTeam.length < 3 &&
          this.hasMatchingSchedule(otherTeam, student) &&
          otherTeam[0].id !== student.id
        ) {
          otherTeam.push(student);
          assignedStudents.add(student.id);
          // Eliminar el equipo que ahora está vacío
          const index = teams.indexOf(singletonTeam);
          if (index > -1) {
            teams.splice(index, 1);
          }
          break;
        }
      }
    });

    // Verificar nuevamente si hay algún estudiante sin asignar
    const finalUnassignedStudents = uniqueUsers.filter(
      (student) => !assignedStudents.has(student.id)
    );

    // Asignar cualquier estudiante restante a un nuevo grupo (si aplica)
    finalUnassignedStudents.forEach((unassigned) => {
      teams.push([unassigned]);
      assignedStudents.add(unassigned.id);
    });

    return teams;
  }


  hasMatchingSchedule(team: Users[], student: Users): boolean {
    return team.every((member) =>
      member.schedules.some((schedule1) =>
        student.schedules.some(
          (schedule2) =>
            schedule1.day === schedule2.day &&
            schedule1.hour_i === schedule2.hour_i &&
            schedule1.hour_f === schedule2.hour_f
        )
      )
    );
  }

  async findTeamByStudentId(courseId: string, studentId: string): Promise<Team | null> {
    const user = await this.authService.findOne(studentId);

    if (!user) {
      throw new NotFoundException(`User with id ${studentId} not found`);
    }

    const teams = await this.teamsRepositoy.find({ where: { course: { id: courseId } }, relations: ['users'] });

    for (const team of teams) {
      if (team.users.some((teamUser) => teamUser.id === studentId)) {
        return team;
      }
    }

    return null;
  }


}
