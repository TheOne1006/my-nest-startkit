import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';
import { Roles, SerializerClass, User } from '../common/decorators';
import { RolesGuard } from '../common/auth';
import { ROLE_USER } from '../common/constants';
import { RequestUser } from '../common/interfaces';
import { UsersService } from './users.service';

import {
  UserRegisterDto,
  UserLoginDto,
  UserLoginResponseDto,
  UserProfileDto,
} from './dtos';

@Controller('api/users')
@ApiTags('users')
@UseInterceptors(SerializerInterceptor)
export class UsersController {
  private readonly logger = new Logger('app:UsersController');
  
  constructor(
    protected readonly service: UsersService,
  ) {}

  @Post('/register')
  @ApiOperation({
    summary: '用户注册',
  })
  @SerializerClass(UserLoginResponseDto)
  async register(@Body() dto: UserRegisterDto): Promise<UserLoginResponseDto> {
    return await this.service.register(dto);
  }

  @Post('/login')
  @ApiOperation({
    summary: '用户登录',
  })
  @SerializerClass(UserLoginResponseDto)
  async login(@Body() dto: UserLoginDto): Promise<UserLoginResponseDto> {
    try {
      return await this.service.login(dto);
    } catch (error) {
      this.logger.error("login failed", error);
      throw new Error("login failed");
    }
  }

  @UseGuards(RolesGuard)
  @Get('/profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '获取用户信息',
  })
  @Roles(ROLE_USER)
  @SerializerClass(UserProfileDto)
  async getProfile(@User() user: RequestUser): Promise<UserProfileDto> {
    const userIns = await this.service.findByPk(user.id);
    if (!userIns) {
      throw new Error("User not found");
    }
    return UsersService.toProfileDto(userIns);
  }
}
