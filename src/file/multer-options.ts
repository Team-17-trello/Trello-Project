import { diskStorage } from 'multer';
import * as path from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 30 * 1024 * 1024 }, //30MB 제한
};
