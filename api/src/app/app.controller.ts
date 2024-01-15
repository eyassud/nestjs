import { Controller, Get, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { Observable, of } from 'rxjs';

@Controller('cats')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('breed')
  getData(): Observable<{ message: string }> {
    return of(this.appService.getData());
  }
}
