import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

  findAll(userId: string) {
    return this.taskModel.find({ userId: new Types.ObjectId(userId) }).sort({ completed: 1, deadline: 1 }).exec();
  }

  create(userId: string, dto: CreateTaskDto) {
    return this.taskModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      dateTime: new Date(dto.dateTime),
      deadline: new Date(dto.deadline),
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const task = await this.taskModel
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId) },
        {
          ...dto,
          ...(dto.dateTime ? { dateTime: new Date(dto.dateTime) } : {}),
          ...(dto.deadline ? { deadline: new Date(dto.deadline) } : {}),
        },
        { new: true },
      )
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async toggleComplete(userId: string, id: string) {
    const task = await this.taskModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.completed = !task.completed;
    return task.save();
  }

  async remove(userId: string, id: string) {
    const result = await this.taskModel.deleteOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }

    return { deleted: true };
  }
}
