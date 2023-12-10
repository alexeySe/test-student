import { Module, forwardRef } from '@nestjs/common';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Grades } from './grades.model';
import { Student } from 'src/student/student.model';
import { StudentModule } from 'src/student/student.module';

@Module({
  controllers: [GradesController],
  providers: [GradesService],
  imports: [forwardRef(() => StudentModule),
    SequelizeModule.forFeature([Grades, Student])
  ]
})
export class GradesModule {}
