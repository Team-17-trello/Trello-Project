import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CardEntity } from 'src/card/entities/card.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {}

  // 파일 첨부
  async attachFile(file: Express.Multer.File, user: UserEntity) {
    const card = await this.cardRepository.findOne({
      where: { userId: user.id }, //userId로 카드 찾기 TODO:문제가 생길여지가 있음.
    });

    if (!card) {
      throw new NotFoundException('카드를 찾을 수 없습니다.');
    }

    const newFile = this.fileRepository.create({
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      card: card, // 카드에 파일을 연결
    });

    await this.fileRepository.save(newFile);

    return newFile; // 단순히 새로 생성된 파일 객체 반환
  }

  // 파일 다운로드
  async downloadFile(fileId: number, res: Response) {
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    const filePath = path.join(__dirname, '..', file.filePath);
    // 파일 스트리밍 처리 및 응답 헤더 설정
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (err) => {
        reject(new NotFoundException('파일을 읽는 중 오류가 발생했습니다.'));
      });

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.fileName}"`,
      });

      fileStream.pipe(res);
      fileStream.on('end', () => resolve(null)); // 스트리밍 끝나면 resolve
    });
  }
}
