import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { LogDto } from './Dto/grades-log.dto';

@Controller('statistic')
export class StatisticController {
    constructor(private statisticService: StatisticService) {}
    @Get()
    getLog(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,): Promise<LogDto[]> {
      return this.statisticService.getLog(page, limit);
    }

    @Get('/:personalCode')
    async getStudentStatistic(@Param('personalCode') personalCode: string): Promise<any> {
      return this.statisticService.getStudentStatistic(personalCode);
    }
}
