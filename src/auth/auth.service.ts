import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { isUUID } from 'class-validator';
import { NotFoundException } from '@nestjs/common';
import { Skills } from '../skills/entities/skill.entity';
import { SkillsService } from '../skills/skills.service';
import { forwardRef } from '@nestjs/common';
import { create } from 'domain';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as XLSX from 'xlsx';
import { TeamsService } from '../teams/teams.service';
import { CoursesService } from '../courses/courses.service';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>, @Inject(forwardRef(() => SkillsService)) private readonly skillsService: SkillsService, private readonly jwtService: JwtService ,  @Inject(forwardRef(() => TeamsService))private readonly teamService: TeamsService ,@Inject(forwardRef(() => CoursesService))  private readonly courseService: CoursesService 
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = Object.assign({ id: uuid(), password: bcrypt.hashSync(password, 10), ...userData });
      return await this.userRepository.save(user);

    } catch (e) {
      this.handleDBErrors(e);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(identifier: string) {
    //const user = await this.userRepository.findOne({ where: { id }, relations: ['skills'] });
    let user: Users;

    if (isUUID(identifier)) {
      user = await this.userRepository.findOne({ where: {id: identifier}, relations: ['skills', 'teams', 'courses'] })
    } else {
      user = await this.userRepository.findOne({ where: {user_code: identifier} , relations: ['skills', 'teams', 'courses'] })
    }

    if (!user) {
      throw new NotFoundException(`User with the id ${identifier} not found`);
    }

    return user;
  }

  async update(identifier: string, updateUserDto: UpdateUserDto) {
    let user: Users;

    if (isUUID(identifier)) {
      user = await this.userRepository.findOneBy({ id: identifier })
    } else {
      user = await this.userRepository.findOneBy({ user_code: identifier })
    }

    if (!user) {
      throw new NotFoundException(`User not found with id or student_code: ${identifier}`);
    }

    if (updateUserDto.password) {
      user.password = bcrypt.hashSync(updateUserDto.password, 10);
    } else {
      delete updateUserDto.password;
    }

    user.email = updateUserDto.email || user.email;
    user.name = updateUserDto.name || user.name;
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    user.last_name = updateUserDto.last_name || user.last_name;
    user.user_code = updateUserDto.user_code || user.user_code;
    user.skills = updateUserDto.skills || user.skills;
    user.teams = updateUserDto.teams || user.teams;
    user.courses = updateUserDto.courses || user.courses;

    return this.userRepository.save(user);
  }

  // istambul no cover
  async remove(identifier: string) {

    let user: Users;

    if (isUUID(identifier)) {
      user = await this.userRepository.findOneBy({ id: identifier })
    } else {
      user = await this.userRepository.findOneBy({ user_code: identifier })
    }

    if (!user) {
      throw new NotFoundException(`User not found with id or student_code: ${identifier}`);
    }


    if (!user) {
      throw new NotFoundException(`User not found with id or student_code: ${identifier}`);
    }

    return await this.userRepository.remove(user);
  }


  private handleDBErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }
    console.log(error);
    throw new InternalServerErrorException('Error creating user');
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password']
    });
    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');


    return {
      user_id: user.id, email: user.email,
      token: this.jwtService.sign({ user_id: user.id })
    };
  }


  readExcel(buffer: Buffer, id:string): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);

    this.importsUsers(jsonData, id)
    return jsonData;
  }

  async importsUsers(jsonData: any[], id: string): Promise<void> {
    for (const person of jsonData) {
      let student_user = new CreateUserDto();

      if (!person.email) {
        console.error('Missing email for person:', person);
        continue;
      }

      student_user.email = person.email;
      student_user.name = person.name;
      student_user.last_name = person.last_name;
      student_user.password = person.password || 'ICESI_2024-1';
      student_user.user_code = person.student_code;
      student_user.role = "student";
      let returnStudent  = null ;

      try {
        console.log(!(await this.userRepository.findBy({email: student_user.email})));
        console.log(await this.userRepository.findBy({email: student_user.email}));


        if ((await this.userRepository.findBy({ email: student_user.email })).length === 0) {
          returnStudent = await this.createUser(student_user);
        } else {
          returnStudent = await this.userRepository.findBy({ email: student_user.email });
        }

        await this.setStudentCourse(id, returnStudent.id);
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  }

  async setStudentCourse(idCourse: string, idStudent: string){
    await this.courseService.addCourseToUser(idCourse, idStudent);
  }


}
