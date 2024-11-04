import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CardModule } from './card/card.module';
import { ListModule } from './list/list.module';
import { CommentModule } from './comment/comment.module';
import { BoardModule } from './board/board.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ItemModule } from './item/item.module';
import { FileModule } from './file/file.module';
import { WorkspaceController } from './workspace/workspace.controller';

@Module({
  imports: [AuthModule, CardModule, ListModule, CommentModule, BoardModule, UserModule, WorkspaceModule, ChecklistModule, ItemModule, FileModule],
  controllers: [AppController, WorkspaceController],
  providers: [AppService],
})
export class AppModule {}
