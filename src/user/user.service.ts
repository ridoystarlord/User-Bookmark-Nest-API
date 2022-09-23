import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditDto) {
    const hash = await argon.hash(dto.password);
    delete dto.password;
    const updateUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        hash,
      },
    });

    delete updateUser.hash;

    return updateUser;
  }
}
