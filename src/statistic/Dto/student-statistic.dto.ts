import { StudentDto } from "./student.dto";
import { SubjectStatisticDto } from "./subject-statistic.dto";

export class StudentStatisticDto {
    student: StudentDto;
    statistic: SubjectStatisticDto[];
  }