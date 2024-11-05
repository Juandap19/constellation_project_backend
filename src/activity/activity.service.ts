import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activitty.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { v4 as uuid } from 'uuid';
import { CoursesService } from '../courses/courses.service';
import { AuthService } from '../auth/auth.service';
import { In } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>, private readonly courseService: CoursesService, private readonly authService: AuthService
  ) {}

  async findAll() {
    const activities = await this.activityRepository.find();
    // if(activities.length===0) {
    //     throw new NotFoundException('No activities found');
    // }
    return activities;
  }

  async getActivitiesByUser(id: string) {
    const user = await this.authService.findOne(id);
    if (!user || !user.courses) {
        return [];
    }

    const courseIds = user.courses.map(c => c.id);
    const activities = await this.activityRepository.find({ where: { course: { id: In(courseIds) } } });

    if (activities.length === 0) {
        return [];
    }

    return activities;
}

  async findOne(id: string) {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if(!activity) {
        throw new NotFoundException(`Activity with id ${id} not found`);
    }
    return activity;
  }

  async create(createActivityDto: CreateActivityDto) {
    const course = await this.courseService.findOne(createActivityDto.course);
    const newActivity = Object.assign({ ...createActivityDto, course, id: uuid() });
    return await this.activityRepository.save(newActivity);
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    const activity = await this.findOne(id);
    if(!activity) {
        throw new NotFoundException(`Activity with id ${id} not found`);
    }
    await this.activityRepository.update(id, updateActivityDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const activity = await this.findOne(id);
    if(!activity) {
        throw new NotFoundException(`Activity with id ${id} not found`);
    }
    await this.activityRepository.delete(id);
  }
}
