import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healtcheck() {
    return {
      status: 'OK',
      time: new Date().toISOString(),
    };
  }
}
