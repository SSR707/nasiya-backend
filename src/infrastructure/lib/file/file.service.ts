import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly uploadDir = 'uploads';

  constructor() {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, subDirectory: string = ''): Promise<{ path: string }> {
    try {
      const targetDir = path.join(this.uploadDir, subDirectory);
      
      // Create subdirectory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Generate unique filename
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(targetDir, fileName);

      // Write file
      fs.writeFileSync(filePath, file.buffer);

      return {
        path: filePath.replace(/\\/g, '/') // Normalize path for different OS
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  async existFile(filePath: string): Promise<boolean> {
    return fs.existsSync(filePath);
  }
}
