import multer from 'multer';
import { config } from '../config/env.js';

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (config.uploadAllowedMime.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Tipo de arquivo não permitido'), false);
}

export const uploadImage = multer({
  storage,
  limits: { fileSize: config.uploadMaxSize },
  fileFilter
}).single('image');
