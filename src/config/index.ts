import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}
  get(name: string): string {
    return this.configService.get<string>(name);
  }
}
