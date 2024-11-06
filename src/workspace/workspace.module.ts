import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Member } from 'src/member/entity/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity, User, Member])],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
