import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as XLSX from 'xlsx';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>, private readonly jwtService: JwtService
) {}

async createUser(createUserDto: CreateUserDto) {
  try{
      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
          id: uuid(),
          password : bcrypt.hashSync(password, 10),
          ...userData});

      await  this.userRepository.save(user);

      return user;

  }catch(e) {
    this.handleDBErrors(e);
  }
}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    let user: Users;

    if(isUUID(id)){
      user = await this.userRepository.findOneBy({id: id})
    }else{
      user = await this.userRepository.findOneBy({user_code: id})
    }

    if(!user){
      throw new NotFoundException(`User with the id ${id} not found`)
    }

    return user;
  }

  async update(identifier: string, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findOne({
      where: [{ id: identifier }, { user_code: identifier }],
    });
  
    if (!user) {
      throw new NotFoundException(`User not found with id or student_code: ${identifier}`);
    }
  
    user.email = updateUserDto.email || user.email;
    user.name = updateUserDto.name || user.name;
    user.password =  bcrypt.hashSync(updateUserDto.password, 10)|| user.password;
    user.last_name = updateUserDto.last_name || user.last_name;
    user.user_code = updateUserDto.user_code || user.user_code;


  
    return this.userRepository.save(user);
  }

  async remove(identifier: string) {
    let user = await this.userRepository.findOne({
      where: [{ id: identifier }, { user_code: identifier }],
    });
  
    if (!user) {
      throw new NotFoundException(`User not found with id or student_code: ${identifier}`);
    }

    return await this.userRepository.remove(user);
  }


  private handleDBErrors(error: any) {
    if(error.code === '23505') {
        throw new BadRequestException('User already exists');
    }

    throw new InternalServerErrorException('Error creating user');
  }

  async  loginUser(loginUserDto: LoginUserDto){
    const {email, password} = loginUserDto;
    const user = await this.userRepository.findOne({
        where: {email}, 
        select: ['id', 'email', 'password']
        });
    if(!user || !bcrypt.compareSync(password, user.password)) 
        throw new UnauthorizedException('Invalid credentials');

    
    return { user_id: user.id, email: user.email,
        token: this.jwtService.sign({user_id: user.id})
    };
  }


  readExcel(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
  
    const jsonData = XLSX.utils.sheet_to_json(sheet);
  
    this.importsUsers(jsonData)
    return jsonData;
  }

  async importsUsers(jsonData: any[]): Promise<void> {
    for (const person of jsonData) {
      const student_user = new CreateUserDto();

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

      try {
        await this.createUser(student_user);
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  }


}
