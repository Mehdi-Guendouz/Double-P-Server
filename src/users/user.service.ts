import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
