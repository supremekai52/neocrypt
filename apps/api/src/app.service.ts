import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; timestamp: string } {
    return {
      message: 'NeoCrypt API is healthy!',
      timestamp: new Date().toISOString(),
    };
  }
}