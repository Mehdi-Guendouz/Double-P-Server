import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/user.service';
import { CreateAuthDto } from './dto/create.auth.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateAuthDto, response: Response) {
    const options = {
      httpOnly: true,
      secure: true,
    };
    const user = await this.usersService.findUserByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.usersService.hashPassword(
      createUserDto.password,
    );

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const token = await this.generateAccessToken(newUser);
    const refreshToken = await this.generateRefreshToken(newUser);
    response.cookie('accessToken', token, options);
    response.cookie('refreshToken', refreshToken, options);

    return {
      token,
      userName: newUser.userName,
      email: newUser.email,
    };
  }

  async login(loginDto: LoginDto, response: Response) {
    const options = {
      httpOnly: true,
      secure: true,
    };
    const user = await this.usersService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(loginDto.password, user.password);
    const isPasswordMatch = await this.usersService.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    response.cookie('accessToken', token, options);
    response.cookie('refreshToken', refreshToken, options);
    return {
      token,
      userName: user.userName,
      email: user.email,
    };
  }

  async generateAccessToken(user: User) {
    return this.jwtService.signAsync(
      {
        id: user._id,
        email: user.email,
      },
      {
        secret: process.env.JWT_SECRET_ACCESS,
        expiresIn: process.env.JWT_EXPIRE_ACCESS,
      },
    );
  }

  async generateRefreshToken(user: User) {
    return this.jwtService.signAsync(
      {
        id: user._id,
      },
      {
        secret: process.env.JWT_SECRET_REFRESH,
        expiresIn: process.env.JWT_EXPIRE_REFRESH,
      },
    );
  }
}
