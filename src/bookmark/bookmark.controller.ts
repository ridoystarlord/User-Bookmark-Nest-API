import {
  Controller,
  Get,
  UseGuards,
  Post,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateDto, EditDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookMarkService: BookmarkService) {}

  @Post('new')
  createBookMarkByUserId(
    @GetUser('id') userId: number,
    @Body() dto: CreateDto,
  ) {
    return this.bookMarkService.createBookMarkByUserId(userId, dto);
  }

  @Get('all')
  getAllBookMarks(@GetUser('id') userId: number) {
    return this.bookMarkService.getAllBookMarks(userId);
  }
  @Get(':id')
  getUserBookMarksById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookMarkService.getUserBookMarksById(userId, bookmarkId);
  }
  @Patch('edit/:id')
  EditBookMarksById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditDto,
  ) {
    return this.bookMarkService.EditBookMarksById(userId, bookmarkId, dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  deleteBookMarksById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookMarkService.deleteBookMarksById(userId, bookmarkId);
  }
}
