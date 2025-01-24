import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = uuidv4() + path.extname(file.originalname);
      const filePath = path.resolve(__dirname, '..', '..', 'static');
      
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      
      return fileName;
    } catch (error) {
      throw new Error('Error while writing file');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      throw new Error('Error while deleting file');
    }
  }

  async existFile(fileName: string): Promise<boolean> {
    try {
      const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }
}
