import { Inject, Injectable } from '@nestjs/common';
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
import { Skills } from 'src/skills/entities/skill.entity';
import { SkillsService } from 'src/skills/skills.service';
import { forwardRef } from '@nestjs/common';
import { create } from 'domain';
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users> , @Inject(forwardRef(() => SkillsService))private readonly skillsService: SkillsService
) {}

async createUser(createUserDto: CreateUserDto) {
  try{
      const {password, ...userData} = createUserDto;
      const user = Object.assign({id: uuid(),password : bcrypt.hashSync(password, 10),...userData});
      return await  this.userRepository.save(user);

  }catch(e) {
    this.handleDBErrors(e);
  }
}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({where: { id }, relations: ['skills']});

    if (!user) {
        throw new NotFoundException(`User with the id ${id} not found`);
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

    if (updateUserDto.password) {
      user.password = bcrypt.hashSync(updateUserDto.password, 10);
    } else {
        delete updateUserDto.password;
    }
    
    user.email = updateUserDto.email || user.email;
    user.name = updateUserDto.name || user.name;
    user.last_name = updateUserDto.last_name || user.last_name;
    user.user_code = updateUserDto.user_code || user.user_code;
    user.skills = updateUserDto.skills || user.skills;
  
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


  private  handleDBErrors(error: any) {
    if(error.code === '23505') {
        throw new BadRequestException('User already exists');
    }
    console.log(error);
    throw new InternalServerErrorException('Error creating user');
    
}
}
