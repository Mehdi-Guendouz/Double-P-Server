import { Injectable } from '@nestjs/common';
import { User } from './schema/users.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password');
  }

  async findUserById(id: Types.ObjectId): Promise<User> {
    return this.userModel.findById(id).select('+password');
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
