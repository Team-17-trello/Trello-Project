import { Controller, Post, UploadedFile, UseInterceptors, Get, Query, Res, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { UserInfo } from '../utils/userInfo-decolator';
import { UserEntity } from '../user/entities/user.entity';
import { Response } from 'express';
import { MemberGuard } from '../guard/members.guard';

@UseGuards(MemberGuard)
@Controller('attachments')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 파일 업로드
  @Post()
  @UseInterceptors(FileInterceptor('file'))  // 'file' 필드로 업로드된 파일을 처리
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @UserInfo() user: UserEntity  // 유저 정보 가져오기
  ) {
    return this.fileService.attachFile(file, user);  // 파일 첨부 서비스 호출
  }

  // 파일 다운로드
  @Get('download')
  async downloadFile(
    @Query('fileId') fileId: number,  // 파일 ID 파라미터로 받기
    @Res() res: Response
  ) {
    return this.fileService.downloadFile(fileId, res);  // 파일 다운로드 서비스 호출
  }
}
