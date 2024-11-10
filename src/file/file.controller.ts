import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { UserInfo } from '../utils/userInfo-decolator';
import { UserEntity } from '../user/entities/user.entity';
import { Response } from 'express';
import { MemberGuard } from '../guard/members.guard';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('파일')
@UseGuards(MemberGuard)
@Controller('attachments')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 파일 업로드
  @Post()
  @ApiOperation({ summary: '파일 업로드' })
  @ApiResponse({
    status: 201,
    description: '파일업로드가 성공적으로 완료되었습니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file')) // 'file' 필드로 업로드된 파일을 처리
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @UserInfo() user: UserEntity, // 유저 정보 가져오기
  ) {
    return this.fileService.attachFile(file, user); // 파일 첨부 서비스 호출
  }

  @Get('download')
  @ApiOperation({ summary: '파일 다운로드' })
  @ApiResponse({
    status: 200,
    description: '파일 다운로드가 성공적으로 완료되었습니다.',
  })
  @ApiResponse({
    status: 500,
    description: '파일 다운로드 중 오류가 발생했습니다.',
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  async downloadFile(
    @Query('fileId') fileId: number, // 파일 ID 파라미터로 받기
    @Res() res: Response,
  ) {
    await this.fileService.downloadFile(fileId, res);
  }
}
