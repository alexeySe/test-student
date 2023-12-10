import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as NATS from 'nats';
import { CreateGradesDto } from 'src/nats/Dto/create-grades.dto';
import { StudentDto } from 'src/statistic/Dto/student.dto';
import { StudentService } from 'src/student/student.service';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/sequelize';
import { Grades } from 'src/grades/grades.model';


@Injectable()
export class NatsService {

    constructor(private readonly configService: ConfigService,
                private studentService: StudentService,
                @InjectModel(Grades) private gradesRepository: typeof Grades, ) {}

    async onModuleInit() {
      await this.subscribeToGradedTopic();
    }
  
  async subscribeToGradedTopic() {
    const nc = await NATS.connect({ servers: 'nats://192.162.246.63:4222' });
    const sc = NATS.StringCodec();
    let data
    const sub = nc.subscribe('students.v1.graded');
    (async () => {
      for await (const m of sub) {
        console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
        data =  sc.decode(m.data) 
        const dataObject = JSON.parse(data);
        console.log('data:', dataObject.data)
        this.processGradedData(dataObject.data)

      }
      console.log('subscription closed');
    })();
  }

  private async processGradedData(dto: CreateGradesDto) {
    const code = dto.personalCode
    console.log('code:', code)
    const student = await this.studentService.getUserByPersonalCode(
        code,
      );
     if(!student) {
        let data = await this.requestStudentData(dto.personalCode)
        const studentDto: StudentDto = plainToClass(StudentDto, data.data);
        await this.studentService.createUser(studentDto)
        console.log(data)
    }
    await this.gradesRepository.create(dto);
  }

  async requestStudentData(personalCode: string) {
    const nc = await NATS.connect({ servers: 'nats://192.162.246.63:4222' });
    const sc = NATS.StringCodec();
    const requestData = { personalCode }
    let responseData: string | undefined; 

    try {
      const response = await nc.request('students.v1.get', sc.encode(JSON.stringify(requestData)), { timeout: 1000 });
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
