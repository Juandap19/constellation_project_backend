import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>
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


  private  handleDBErrors(error: any) {
    if(error.code === '23505') {
        throw new BadRequestException('User already exists');
    }

    throw new InternalServerErrorException('Error creating user');
}
}
