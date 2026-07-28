import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.userModel.create({ email, password });
    return { id: user._id.toString(), email: user.email };
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
