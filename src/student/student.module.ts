import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [],
  providers: [StudentService],
  imports: [
    SequelizeModule.forFeature([Student]),
  ],
  exports: [StudentService]
})
export class StudentModule {}
