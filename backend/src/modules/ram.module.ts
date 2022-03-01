import { CacheModule, Module } from '@nestjs/common';
import { RamService } from '../services/ram.service';
import * as redisStore from 'cache-manager-redis-store';
import { RamController } from '../controllers/ram.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteCharacterRepository } from '../repositories/favoriteCharacter.repository';

/**
 * Sets up User module.
 */
@Module({
  controllers: [RamController],
  providers: [RamService],
  imports: [
    TypeOrmModule.forFeature([FavoriteCharacterRepository]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('redis.host'),
        port: +configService.get<number>('redis.port'),
        ttl: 300, // 5 minutes
        max: 20, // Max number of items
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class RamModule {}
