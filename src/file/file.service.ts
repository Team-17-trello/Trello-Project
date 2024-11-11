import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as fs from 'fs';
import mime from 'mime';
import * as path from 'path';
import { CardEntity } from 'src/card/entities/card.entity';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {}

  // 파일 첨부
  async attachFile(file: Express.Multer.File, cardId: string, filePath: string) {
    const card = await this.cardRepository.findOne({
      where: { id: +cardId },
    });

    if (!card) {
      throw new NotFoundException('카드를 찾을 수 없습니다.');
    }

    console.log(file);

    const newFile = this.fileRepository.create({
      fileName: file.originalname,
      filePath: filePath,
      fileSize: file.size,
      card: card, // 카드에 파일을 연결
    });

    await this.fileRepository.save(newFile);

    return newFile; // 단순히 새로 생성된 파일 객체 반환
  }

  // 파일 다운로드
  async downloadFile(fileId: number, @Res() res: Response) {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });

    if (!file) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    const filePath = path.join(process.cwd(), file.filePath);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    const mimeType = mime.lookup(file.filePath) || 'application/octet-stream';

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.fileName)}"; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
    });

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('파일 읽기 중 오류 발생:', err);
      res.status(500).json({ message: '파일을 읽는 중 오류가 발생했습니다.' });
    });
  }
}
