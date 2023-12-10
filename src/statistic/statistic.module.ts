import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Grades } from 'src/grades/grades.model';
import { Student } from 'src/student/student.model';
import { StudentModule } from 'src/student/student.module';

@Module({
  providers: [StatisticService],
  controllers: [StatisticController],
  imports: [SequelizeModule.forFeature([Grades, Student]),
            StudentModule]
})
export class StatisticModule {}
