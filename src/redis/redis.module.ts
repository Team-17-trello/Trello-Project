import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()  // 전역 모듈로 설정
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          password: 'JTy48Q3LflcpXIBMCjkl3al9q2FmOJ5h', // 비밀번호가 있는 경우 설정
          socket: {
            host: 'redis-16517.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com',
            port: 16517,  // Redis 포트
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