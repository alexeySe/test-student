import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Student } from './student.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [
    ClientsModule.register([
      { name: 'NATS_SERVICE', transport: Transport.NATS },
    ]),
    SequelizeModule.forFeature([Student]),
  ],
  exports: [StudentService]
})
export class StudentModule {}
