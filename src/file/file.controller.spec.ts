import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { UserEntity } from '../user/entities/user.entity';
import { MemberGuard } from '../guard/members.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('FileController', () => {
  let fileController: FileController;
  let fileService: FileService;

  const mockFileService = {
    attachFile: jest.fn(),
    downloadFile: jest.fn(),
  };

  const mockUser: UserEntity = {
    id: 1,
  } as UserEntity;

  const mockResponse = {
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    })
      .overrideGuard(MemberGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    fileController = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('파일 업로드에 성공합니다.', async () => {
      const mockFile = { originalname: 'test.txt' } as Express.Multer.File;
      const expectedResponse = { message: '파일업로드가 성공적으로 완료되었습니다.' };

      mockFileService.attachFile.mockResolvedValue(expectedResponse);

      const result = await fileController.uploadFile(mockFile, mockUser);

      expect(fileService.attachFile).toHaveBeenCalledWith(mockFile, mockUser);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('downloadFile', () => {
    it('파일 다운로드에 성공합니다.', async () => {
      const fileId = 1;

      await fileController.downloadFile(fileId, mockResponse);

      expect(fileService.downloadFile).toHaveBeenCalledWith(fileId, mockResponse);
    });

    it('파일 다운로드 중 오류가 발생합니다.', async () => {
      const fileId = 999;
      const error = new NotFoundException('파일을 찾을 수 없습니다.');

      mockFileService.downloadFile.mockRejectedValue(error);

      await expect(fileController.downloadFile(fileId, mockResponse)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
