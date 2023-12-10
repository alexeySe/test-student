import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './student/student.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Grades } from './grades/grades.model';
import { StatisticModule } from './statistic/statistic.module';
import { NatsModule } from './nats/nats.module';

@Module({
  imports: [
    StudentModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
  }),
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://192.162.246.63:4222'],
        },
      },
    ]),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'), 
        username: configService.get('POSTGRES_USER'),  
        password: configService.get('POSTGRES_PASSWORD'), 
        database: configService.get('POSTGRES_DB'), 
        models: [Student, Grades],
        autoLoadModels: true,
      })
    }),
    StatisticModule,
    NatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
