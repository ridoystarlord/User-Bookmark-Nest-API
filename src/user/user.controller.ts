import { UseGuards, Controller, Get, Patch, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @Patch('edit')
  editUser(@GetUser('id') userId: number, @Body() user: EditDto) {
    return this.userService.editUser(userId, user);
  }
}
