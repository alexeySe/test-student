import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from './student.model';
import { CreateStudentDto } from './create-student.dto';

@Injectable()
export class StudentService {
    constructor(@InjectModel(Student) private studentRepository: typeof Student) {}

    async createUser( dto: CreateStudentDto) {
        const existStudent = await this.getUserByPersonalCode(dto.personalCode)
        if (existStudent) {
            throw new HttpException('Student with this personalCode exists', HttpStatus.BAD_REQUEST);
        } else {
        const student = await this.studentRepository.create(dto)
        return student
        }
        
    }

    async getUserByPersonalCode(personalCode: string) {
        const student = await this.studentRepository.findOne({where:{personalCode}})
        return student
    }
}
