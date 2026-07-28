import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return {
      name: 'TaskPilot API',
      status: 'running',
      routes: ['/auth/register', '/auth/login', '/tasks'],
    };
  }
}
