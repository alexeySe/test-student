export class LogDto {
    date: string;
    subject: string;
    grade: number;
    student: {
      personalCode: string;
      name: string;
      lastName: string;
    };
  }