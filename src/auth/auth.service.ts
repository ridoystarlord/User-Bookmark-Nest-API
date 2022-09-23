import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      return this.generateToken(newUser.id, newUser.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Email is Already Used');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credential Not Found');
    }
    const isMatch = await argon.verify(user.hash, dto.password);
    if (!isMatch) {
      throw new ForbiddenException('Credential Incorrect');
    }
    return this.generateToken(user.id, user.email);
  }

  async generateToken(
    userId: number,
    email: string,
  ): Promise<{ token: string }> {
    const payload = {
      id: userId,
      email: email,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return { token: token };
  }
}
