import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global() // 전역 모듈로 설정
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          password: process.env.REDISPASSWORD, // 비밀번호가 있는 경우 설정
          socket: {
            host: process.env.REDISHOST,
            port: 16517, // Redis 포트
          },
        });

        try {
          await client.connect();
        } catch (error) {
          console.error('Redis 연결 실패:', error);
        }

        // 연결된 클라이언트 반환
        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
