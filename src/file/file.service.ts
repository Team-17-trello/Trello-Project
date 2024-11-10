import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CardEntity } from '../card/entities/card.entity';
import { Response } from 'express';
import { UserEntity } from '../user/entities/user.entity';


@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {
  }

  // 파일 첨부
  async attachFile(file: Express.Multer.File, user: UserEntity) {
    // 파일을 카드에 연결해서 저장
    const card = await this.cardRepository.findOne({
      where: { id: user.id }, // 예시로 유저 ID로 카드를 찾는 부분 (실제 로직에 맞게 수정 필요)
    });

    if (!card) {
      throw new NotFoundException('카드를 찾을 수 없습니다.');
    }

    const newFile = this.fileRepository.create({
      fileName: file.originalname,
      filePath: file.path,  // 업로드된 파일 경로
      fileSize: file.size,
      card: card,  // 파일을 카드에 연결
    });

    await this.fileRepository.save(newFile);

    return {
      statusCode: 201,
      message: '파일이 성공적으로 업로드 되었습니다.',
      file: newFile,
    };
  }

  // 파일 다운로드
  async downloadFile(fileId: number, res: Response) {
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    const filePath = path.join(__dirname, '..', file.filePath);  // 파일 경로 설정

    // 파일 다운로드 헤더 설정
    res.set({
      'Content-Type': 'application/octet-stream',  // 파일 타입 설정
      'Content-Disposition': `attachment; filename="${file.fileName}"`,  // 다운로드 파일 이름 설정
    });

    // 파일을 스트리밍해서 Response로 보내기
    fs.createReadStream(filePath).pipe(res);  // Express Response로 스트리밍
  }
}
