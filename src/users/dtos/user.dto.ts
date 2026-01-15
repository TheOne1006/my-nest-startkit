import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({ example: 'user123', description: '用户名' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'user@theone.io', description: '邮箱' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user', description: '密码', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class UserLoginDto {
  @ApiProperty({ example: 'admin@theone.io', description: '邮箱' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'admin', description: '密码' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserProfileDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  roles: string[];
}

export class UserLoginResponseDto {
  @Expose()
  @Type(() => UserProfileDto)
  user: UserProfileDto;

  @ApiProperty({ description: '访问令牌' })
  token: string;
}

export class UserDeleteResponseDto {
  @Expose()
  deleted: boolean;
}
