import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
  exports: [WorkspaceService], // 필요한 경우 다른 모듈에서 사용할 수 있도록 export
})
export class WorkspaceModule {}
