import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis'; // Redis 클라이언트 타입

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: RedisClientType) {}

  // 인증번호 저장 (유효기간 설정)
  async set(key: string, value: string, expiration: number): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client is not connected');
    }
    await this.client.setEx(key, expiration, value); // setEx 사용
  }

  // 저장된 인증번호 가져오기
  async get(email: string): Promise<string | null> {
    if (!this.client) {
      throw new Error('Redis client is not connected');
    }

    return this.client.get(email); // get 사용
  }

  // Redis 연결 종료
  async close() {
    if (this.client) {
      await this.client.quit(); // 연결 종료
    }
  }
}
