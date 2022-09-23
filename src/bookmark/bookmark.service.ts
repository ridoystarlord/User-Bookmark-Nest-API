import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto, EditDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getAllBookMarks(userId: number) {
    const getAllBookMarksOfUser = await this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
    return getAllBookMarksOfUser;
  }
  async getUserBookMarksById(userId: number, bookmarkId: number) {
    const getAllBookMarksOfUser = await this.prisma.bookmark.findFirst({
      where: {
        userId: userId,
        id: bookmarkId,
      },
    });
    return getAllBookMarksOfUser;
  }
  async EditBookMarksById(userId: number, bookmarkId: number, dto: EditDto) {
    const oldBookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!oldBookmark || oldBookmark.userId !== userId) {
      throw new ForbiddenException('You are not owner of this Bookmark');
    }
    const updateBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
    return updateBookmark;
  }
  async deleteBookMarksById(userId: number, bookmarkId: number) {
    const oldBookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!oldBookmark || oldBookmark.userId !== userId) {
      throw new ForbiddenException('You are not owner of this Bookmark');
    }
    const deleteBookMarks = await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return deleteBookMarks;
  }
  async createBookMarkByUserId(userId: number, dto: CreateDto) {
    const newBookMarks = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return newBookMarks;
  }
}
