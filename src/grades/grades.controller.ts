import { Body, Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CreateGradesDto } from './create-grades.dto';
import { GradesService } from './grades.service';


@Controller('grades')
export class GradesController {

 constructor(private gradeService: GradesService) {}

 @Post()
 testGrades(@Body() dto: CreateGradesDto) {
    return this.gradeService.createGrades(dto)
 }

}