import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { UpdateRubricDto } from './dto/update-rubric.dto';
import { Rubric } from './entities/rubric.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Activity } from '../activity/entities/activity.entity';

@Injectable()
export class RubricService {
  
  constructor(@InjectRepository(Rubric) private readonly rubricRepository: Repository<Rubric>, @InjectRepository(Activity) private readonly activityRepository: Repository<Activity>) {}

  async create(createRubricDto: CreateRubricDto) {
    const activity = await this.activityRepository.findOne({ where: { id: createRubricDto.activityId } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${createRubricDto.activityId} not found`);
    }

    const rubric = Object.assign({...createRubricDto, id: uuid(), activity});
    return await this.rubricRepository.save(rubric);
  }

  async findAll() {
    return await this.rubricRepository.find({ relations: ['criterias', 'activity'] });
  }

  async findOne(id: string) {
    const rubric = await this.rubricRepository.findOne({ where: { id }, relations: ['activity', 'criterias'] });
    if (!rubric) {
      throw new NotFoundException(`Rubric with ID ${id} not found`);
    }
    return rubric;
  }

  async update(id: string, updateRubricDto: UpdateRubricDto) {
    const rubric = await this.findOne(id);
    const activity = await this.activityRepository.findOne({ where: { id: updateRubricDto.activityId } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${updateRubricDto.activityId} not found`);
    }

    Object.assign(rubric, updateRubricDto);
    return await this.rubricRepository.save(rubric);
  }

  async remove(id: string) {
    const rubric = await this.findOne(id);
    await this.rubricRepository.remove(rubric);
  }
}


