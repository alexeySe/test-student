import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Student } from "src/student/student.model";

@Table({
    createdAt: true,
    updatedAt: false, 
  })
export class Grades extends Model<Grades> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  subject: string

  @Column({type: DataType.INTEGER, allowNull: false})
  grade: number;

  @ForeignKey(() => Student)
  @Column
  personalCode: string;

  @BelongsTo(() => Student, 'personalCode')
  student: Student;
}
