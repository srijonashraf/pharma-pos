import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Pharma POS Server',
      version: '0.0.1',
      status: 'running',
    };
  }
}
