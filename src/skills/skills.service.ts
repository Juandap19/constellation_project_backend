import { Inject, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skills } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { isUUID } from 'class-validator';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { forwardRef } from '@nestjs/common';

@Injectable()
export class SkillsService {

  constructor(@InjectRepository(Skills) private readonly skillRepository: Repository<Skills> , @Inject(forwardRef(() => AuthService))private readonly authService: AuthService ) {}


 
  async create(skill: CreateSkillDto) {
    
    const users = await this.authService.findOne(skill.users);
    const newSkill = Object.assign({...skill, id: uuid(), users})
    return await this.skillRepository.save(newSkill);
  }

  findAll() {
    return this.skillRepository.find({relations: ['users']});
  }

  async findOne(id: string) {

    let skill: Skills;

    if(isUUID(id)){
      skill = await this.skillRepository.findOne({ where: { id }})
    }

    if(!skill){
      throw new NotFoundException(`Skill with the id ${id} not found`)
    }

    return skill;
  }

  async update(identifier: string, updateSkillDto: UpdateSkillDto) {
    let skill = await this.skillRepository.findOne({
      where: [{ id: identifier }],
    });
  
    if (!skill) {
      throw new NotFoundException(`Skill not found with id : ${identifier}`);
    }
  
    skill= Object.assign(skill, updateSkillDto);

  
    return this.skillRepository.save(skill);
  }
  

  async remove(identifier: string) {
    let skill = await this.skillRepository.findOne({
      where: [{ id: identifier }],
    });
  
    if (!skill) {
      throw new NotFoundException(`Skill not found with id : ${identifier}`);
    }

    return await this.skillRepository.remove(skill);
  }



}
