import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Grades } from 'src/grades/grades.model';
import { Student } from 'src/student/student.model';
import { LogDto } from './Dto/grades-log.dto';
import { Sequelize } from 'sequelize-typescript';
import { StudentStatisticDto } from './Dto/student-statistic.dto';
import { SubjectStatisticDto } from './Dto/subject-statistic.dto';
import { StudentDto } from './Dto/student.dto';
import { QueryTypes } from 'sequelize';

export interface StudentStatistic {
      personalCode: string,
      name: string,
      lastName: string,
      subject: string,
      maxgrade: number,
      mingrade: number,
      avggrade: string,
      totalgrades: string,
};

@Injectable()
export class StatisticService {

    constructor(@InjectModel(Grades) private gradesRepository: typeof Grades,
                private readonly sequelize: Sequelize) {}

    async getLog(page: number = 1, limit: number = 10): Promise<LogDto[]> {
        const logs = await this.gradesRepository.findAll({
          offset: (page - 1) * limit,
          limit,
          order: [['createdAt', 'DESC']],
          include: [{ model: Student, attributes: ['personalCode', 'firstName', 'lastName'] }],
        });
    
        return logs.map((log) => ({
          date: log.createdAt.toISOString(),
          subject: log.subject,
          grade: log.grade,
          student: {
            personalCode: log.student.personalCode,
            name: log.student.firstName,
            lastName: log.student.lastName,
          },
        }));
    }

    async getStudentStatistic(personalCode: string) {
        const studentStatistic: StudentStatistic[] = await this.sequelize.query(`
        SELECT
          s."personalCode",
          s."firstName" as name,
          s."lastName",
          g.subject,
          MAX(g.grade) as maxGrade,
          MIN(g.grade) as minGrade,
          AVG(g.grade) as avgGrade,
          COUNT(g.grade) as totalGrades
        FROM
          "Students" as s
        LEFT JOIN
          "Grades" as g ON s."personalCode" = g."personalCode"
        WHERE
          s."personalCode" = :personalCode
        GROUP BY
          s."personalCode", s."firstName", s."lastName", g.subject;
      `, { replacements: { personalCode }, nest: true, type: QueryTypes.SELECT });
    

        const studentDto: StudentDto = {
          personalCode: studentStatistic[0].personalCode,
          name: studentStatistic[0].name,
          lastName: studentStatistic[0].lastName,
        };

        const subjectStatistic: SubjectStatisticDto[] = studentStatistic.map((row) => ({
          subject: row.subject,
          maxGrade: row.maxgrade,
          minGrade: row.mingrade,
          avgGrade: parseFloat(row.avggrade),
          totalGrades: parseInt(row.totalgrades),
          }));
    
        const result: StudentStatisticDto = {
          student: studentDto,
          statistic: subjectStatistic,
        };
    
        return [result];
      }
}
