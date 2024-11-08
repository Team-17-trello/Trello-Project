import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MemberEntity } from '../member/entity/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MemberEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
