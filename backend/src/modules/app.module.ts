import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../config/configuration';
import validationSchema from '../config/validation';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { AuthModule } from './auth.module';
import { RamModule } from './ram.module';
import { UserModule } from './user.module';

/**
 * Sets up the entire app module.
 */
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: +configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: 'rick_and_morty',
        entities: ['dist/entities/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    AuthModule,
    UserModule,
    RamModule,
  ],
})
export class AppModule {}
