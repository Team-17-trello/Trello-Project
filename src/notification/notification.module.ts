import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
