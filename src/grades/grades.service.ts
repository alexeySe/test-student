import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Grades } from './grades.model';
import { CreateGradesDto } from './create-grades.dto';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class GradesService {
    constructor(@InjectModel(Grades) private gradesRepository: typeof Grades,
                private studentService: StudentService) {}

    async createGrades(dto: CreateGradesDto) {
        const student = await this.studentService.getUserByPersonalCode(dto.personalCode)
        if(!student) {
            //Пойти и попросить студента, а пока
            // findOrCreate
            throw new NotFoundException('Student not found')
        } 
        const grades = await this.gradesRepository.create(dto)
        return grades
    }

}
