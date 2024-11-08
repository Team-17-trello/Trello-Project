import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { BoardEntity } from './board/entities/board.entity';
import { CardModule } from './card/card.module';
import { CardEntity } from './card/entities/card.entity';
import { ResponsibleEntity } from './card/entities/responsible.entity';
import { ChecklistModule } from './checklist/checklist.module';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/entities/comment.entity';
import { FileModule } from './file/file.module';
import { ItemModule } from './item/item.module';
import { ListEntity } from './list/entities/list.entity';
import { ListModule } from './list/list.module';
import { MemberEntity } from './member/entity/member.entity';
import { UserEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { WorkspaceEntity } from './workspace/entities/workspace.entity';
import { WorkspaceModule } from './workspace/workspace.module';

import { ChecklistEntity } from './checklist/entities/checklist.entity';
import { itemsEntity } from './item/entities/item.entity';

const typeOrmModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      BoardEntity,
      UserEntity,
      ListEntity,
      MemberEntity,
      CardEntity,
      ResponsibleEntity,
      WorkspaceEntity,
      ChecklistEntity,
      CommentEntity,
      itemsEntity,
    ],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    CardModule,
    ListModule,
    CommentModule,
    BoardModule,
    UserModule,
    WorkspaceModule,
    ChecklistModule,
    ItemModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
