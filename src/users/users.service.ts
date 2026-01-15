import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../common/auth/auth.service';
import {
  UserRegisterDto,
  UserLoginDto,
  UserLoginResponseDto,
  UserProfileDto,
} from './dtos';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { generatePasswordHash, verifyPassword } from './utils/password.util';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('app:UsersService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 静态方法：将数据库 User 对象转换为 UserProfileDto
   * 统一处理类型转换和字段映射
   */
  static toProfileDto(user: User): UserProfileDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: (user.roles as unknown as string[]) || [],
    };
  }

  async findOne(where: any): Promise<User | null> {
    return this.prisma.user.findFirst({ where });
  }

  async register(registerDto: UserRegisterDto): Promise<UserLoginResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new Error("email already exists");
    }

    const { salt, hash: password } = await generatePasswordHash(registerDto.password);

    try {
      const ins = await this.prisma.user.create({
        data: {
          ...registerDto,
          password,
          salt,
        },
      });

      const payload = UsersService.toProfileDto(ins);

      const token = await this.authService.sign(payload);
      return {
        user: payload,
        token,
      };
    } catch (error) {
      this.logger.error("create user failed", error);
      throw new Error("create user failed");
    }
  }

  async login(loginDto: UserLoginDto): Promise<UserLoginResponseDto> {
    const ins = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!ins) {
      throw new Error("user not found");
    }

    const isPasswordValid = await verifyPassword(loginDto.password, ins.salt, ins.password);
    if (!isPasswordValid) {
      throw new Error("invalid password");
    }

    const payload = UsersService.toProfileDto(ins);
    const token = await this.authService.sign(payload);

    return {
      user: payload,
      token,
    };
  }

  async findByPk(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async deleteUser(id: string): Promise<void> {
      await this.prisma.user.delete({
        where: { id },
      });
  }
}
