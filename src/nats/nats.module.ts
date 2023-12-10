import { Module } from '@nestjs/common';
import { NatsController } from './nats.controller';
import { NatsService } from './nats.service';
import { StudentModule } from 'src/student/student.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Grades } from 'src/grades/grades.model';


@Module({
  controllers: [NatsController],
  providers: [NatsService],
  exports: [NatsService],
  imports: [StudentModule,
    SequelizeModule.forFeature([Grades])]
})
export class NatsModule {}
