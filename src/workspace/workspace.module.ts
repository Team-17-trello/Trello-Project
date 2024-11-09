import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemberEntity } from 'src/member/entity/member.entity';
import { MailService } from 'src/auth/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity, UserEntity, MemberEntity])],
  providers: [WorkspaceService, MailService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
