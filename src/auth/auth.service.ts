import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async register(registerDto: RegisterUserDto) {
    const { username, password, isGuestUser } = registerDto;
    // Check if username already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    // Check if it a guestUser.
    if (isGuestUser) {
      const newUser = this.userRepository.create({
        username,
        password: '',
        correctAttempts: 0,
        incorrectAttempts: 0,
        totalAttempts: 0,
        isGuestUser: true,
      });

      await this.userRepository.save(newUser);
      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        'your_secret_key', // Replace with env variable later
        { expiresIn: '1h' },
      );
      return {
        success: true,
        message: 'Guest user registered successfully',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          score: newUser.correctAttempts,
          createdAt: newUser.createdAt,
        },
      };
    }

    if (!password) {
      throw new BadRequestException('Password is required for normal users');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      correctAttempts: 0,
      incorrectAttempts: 0,
      totalAttempts: 0,
      isGuestUser: false,
    });
    await this.userRepository.save(newUser);
    return { message: 'User registered successfully' };
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    let isPasswordValid;
    if (user.password) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      'your_secret_key', // Replace with env variable later
      { expiresIn: '1h' }, // Token expires in 1 hour
    );
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        score: user.correctAttempts,
        createdAt: user.createdAt,
      },
    };
  }
}
