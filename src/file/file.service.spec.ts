import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

jest.mock('fs');

describe('FileService', () => {
  let fileService: FileService;
  let fileRepository: Repository<FileEntity>;
  let cardRepository: Repository<CardEntity>;

  const mockFileRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCardRepository = {
    findOne: jest.fn(),
  };

  const mockUser: UserEntity = {
    id: 1,
  } as UserEntity;

  const mockFile = {
    originalname: 'test.txt',
    path: 'uploads/test.txt',
    size: 1024,
  } as Express.Multer.File;

  const mockResponse = {
    set: jest.fn(),
    pipe: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: mockFileRepository,
        },
        {
          provide: getRepositoryToken(CardEntity),
          useValue: mockCardRepository,
        },
      ],
    }).compile();

    fileService = module.get<FileService>(FileService);
    fileRepository = module.get<Repository<FileEntity>>(getRepositoryToken(FileEntity));
    cardRepository = module.get<Repository<CardEntity>>(getRepositoryToken(CardEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('attachFile', () => {
    it('파일 첨부에 성공합니다.', async () => {
      const mockCard = { id: 1, userId: mockUser.id };
      mockCardRepository.findOne.mockResolvedValue(mockCard);
      mockFileRepository.create.mockReturnValue(mockFile);
      mockFileRepository.save.mockResolvedValue(mockFile);

      const result = await fileService.attachFile(mockFile, mockUser);

      expect(cardRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
      expect(fileRepository.create).toHaveBeenCalledWith({
        fileName: mockFile.originalname,
        filePath: mockFile.path,
        fileSize: mockFile.size,
        card: mockCard,
      });
      expect(result).toEqual(mockFile);
    });

    it('카드를 찾을 수 없을 때 NotFoundException을 발생시킵니다.', async () => {
      mockCardRepository.findOne.mockResolvedValue(null);

      await expect(fileService.attachFile(mockFile, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('downloadFile', () => {
    it('파일 다운로드에 성공합니다.', async () => {
      const mockFileEntity = { id: 1, filePath: 'uploads/test.txt', fileName: 'test.txt' };
      const filePath = path.join(__dirname, '..', mockFileEntity.filePath);
      mockFileRepository.findOne.mockResolvedValue(mockFileEntity);
      (fs.createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn().mockImplementationOnce(() => {
          mockResponse.pipe(mockResponse);
        }),
        on: jest.fn((event, callback) => {
          if (event === 'end') callback();
        }),
      });

      await fileService.downloadFile(1, mockResponse);

      expect(fileRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${mockFileEntity.fileName}"`,
      });
    });

    it('파일을 찾을 수 없을 때 NotFoundException을 발생시킵니다.', async () => {
      mockFileRepository.findOne.mockResolvedValue(null);

      await expect(fileService.downloadFile(1, mockResponse)).rejects.toThrow(NotFoundException);
    });

    it('파일 스트림에서 오류가 발생할 때 NotFoundException을 발생시킵니다.', async () => {
      const mockFileEntity = { id: 1, filePath: 'uploads/test.txt', fileName: 'test.txt' };
      const filePath = path.join(__dirname, '..', mockFileEntity.filePath);
      mockFileRepository.findOne.mockResolvedValue(mockFileEntity);

      (fs.createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn(),
        on: jest.fn((event, callback) => {
          if (event === 'error') callback(new Error('파일 읽기 오류'));
        }),
      });

      await expect(fileService.downloadFile(1, mockResponse)).rejects.toThrow(NotFoundException);
      expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    });
  });
});
