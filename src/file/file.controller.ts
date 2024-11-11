import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { MemberGuard } from '../guard/members.guard';
import { FileUploadDto } from './dto/create-file.dto';
import { FileService } from './file.service';
import { multerOptions } from './multer-options';

@ApiBearerAuth()
@ApiTags('파일')
@UseGuards(MemberGuard)
@Controller('attachments')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 파일 업로드
  @Post(':cardId')
  @ApiOperation({ summary: '파일 업로드' })
  @ApiResponse({
    status: 201,
    description: '파일업로드가 성공적으로 완료되었습니다.',
  })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', multerOptions)) // 'file' 필드로 업로드된 파일을 처리
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '파일 업로드',
    type: FileUploadDto,
  })
  async uploadFile(@Param('cardId') cardId: string, @UploadedFile() file: Express.Multer.File) {
    const filePath = file.path;
    const uploadResult = await this.fileService.attachFile(file, cardId, filePath);
    return { message: '파일 업로드가 완료되었습니다.', file: uploadResult };
  }

  @Get('download/:fileId')
  @ApiOperation({ summary: '파일 다운로드' })
  @ApiResponse({
    status: 200,
    description: '파일 다운로드가 성공적으로 완료되었습니다.',
  })
  @ApiResponse({
    status: 500,
    description: '파일 다운로드 중 오류가 발생했습니다.',
  })
  @HttpCode(HttpStatus.OK)
  async downloadFile(
    @Param('fileId') fileId: number, // 파일 ID 파라미터로 받기
    @Res() res: Response,
  ) {
    try {
      await this.fileService.downloadFile(fileId, res);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send('파일을 찾을 수 없습니다.');
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('파일 다운로드 중 오류가 발생했습니다.');
      }
    }
  }
}
