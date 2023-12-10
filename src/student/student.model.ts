import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Grades } from 'src/grades/grades.model';

@Table({
  timestamps: false
})
export class Student extends Model<Student> {

  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  personalCode: string

  @Column({type: DataType.STRING, allowNull: false})
  firstName: string;

  @Column({type: DataType.STRING, allowNull: false})
  lastName: string;

  @HasMany(() => Grades)
    grade: Grades[]
}
