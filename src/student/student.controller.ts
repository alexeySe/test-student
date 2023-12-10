import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';
import { CreateStudentDto } from './create-student.dto';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
    constructor(
        private studentService: StudentService,
        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) {}

    // @MessagePattern('students.v1.graded')
    // getAny(@Payload() data: any, @Ctx() context: NatsContext) {
    //     console.log(`Subject: ${context.getSubject()}`)
    // }

    @Post()
    createStudent(@Body() dto: CreateStudentDto){
        return this.studentService.createUser(dto)
    }
}
