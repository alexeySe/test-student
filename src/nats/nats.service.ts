import { Injectable } from '@nestjs/common';
import * as NATS from 'nats';
import { CreateGradesDto } from 'src/nats/Dto/create-grades.dto';
import { StudentDto } from 'src/statistic/Dto/student.dto';
import { StudentService } from 'src/student/student.service';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/sequelize';
import { Grades } from 'src/student/grades.model';

@Injectable()
export class NatsService {
  constructor(
    private studentService: StudentService,
    @InjectModel(Grades) private gradesRepository: typeof Grades,
  ) {}

  async onModuleInit() {
    await this.subscribeToGradedTopic();
  }

  async subscribeToGradedTopic() {
    const nc = await NATS.connect({ servers: 'nats://192.162.246.63:4222' });
    const sc = NATS.StringCodec();
    let data;
    const sub = nc.subscribe('students.v1.graded');
    (async () => {
      for await (const m of sub) {
        data = sc.decode(m.data);
        const dataObject = JSON.parse(data);
        this.processGradedData(dataObject.data);
      }
    })();
  }

  private async processGradedData(dto: CreateGradesDto) {
    const code = dto.personalCode;
    const student = await this.studentService.getUserByPersonalCode(code);
    if (!student) {
      try {
        let data = await this.requestStudentData(dto.personalCode);
        const studentDto: StudentDto = plainToClass(StudentDto, data.data);
        await this.studentService.createUser(studentDto);
        await this.gradesRepository.create(dto);
      } catch (error) {
        console.error('Ошибка при запросе данных студента:', error);
      }
    }
  }

  async requestStudentData(personalCode: string) {
    const nc = await NATS.connect({ servers: 'nats://192.162.246.63:4222' });
    const sc = NATS.StringCodec();
    let responseData: string | undefined;
    const requestData = JSON.stringify({ personalCode });
    try {
      const response = await nc.request(
        'students.v1.get',
        sc.encode(requestData),
        { timeout: 1000 },
      );
      responseData = sc.decode(response.data);
    } catch (err) {
      console.log(`problem with request: ${err.message}`);
    } finally {
      await nc.close();
    }
    const dataObject = JSON.parse(responseData);
    return dataObject;
  }
}
