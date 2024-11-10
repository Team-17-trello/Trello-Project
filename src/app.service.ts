import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
@Injectable()
export class AppService {
  constructor(private readonly cacheManager: Cache) {}
}
