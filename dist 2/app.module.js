"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const joi_1 = __importDefault(require("joi"));
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const auth_module_1 = require("./auth/auth.module");
const board_module_1 = require("./board/board.module");
const board_entity_1 = require("./board/entities/board.entity");
const card_module_1 = require("./card/card.module");
const checklist_module_1 = require("./checklist/checklist.module");
const comment_module_1 = require("./comment/comment.module");
const file_module_1 = require("./file/file.module");
const workspace_entity_1 = require("./workspace/entities/workspace.entity");
const item_module_1 = require("./item/item.module");
const list_entity_1 = require("./list/entities/list.entity");
const list_module_1 = require("./list/list.module");
const user_entity_1 = require("./user/entities/user.entity");
const user_module_1 = require("./user/user.module");
const workspace_module_1 = require("./workspace/workspace.module");
const member_entity_1 = require("./member/entity/member.entity");
const member_module_1 = require("./member/member.module");
const typeOrmModuleOptions = {
    useFactory: (configService) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
            type: 'mysql',
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            database: configService.get('DB_NAME'),
            entities: [workspace_entity_1.WorkspaceEntity, board_entity_1.BoardEntity, user_entity_1.User, member_entity_1.Member, list_entity_1.ListEntity],
            synchronize: configService.get('DB_SYNC'),
            logging: true,
        });
    }),
    inject: [config_1.ConfigService],
};
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: joi_1.default.object({
                    JWT_SECRET_KEY: joi_1.default.string().required(),
                    DB_USERNAME: joi_1.default.string().required(),
                    DB_PASSWORD: joi_1.default.string().required(),
                    DB_HOST: joi_1.default.string().required(),
                    DB_PORT: joi_1.default.number().required(),
                    DB_NAME: joi_1.default.string().required(),
                    DB_SYNC: joi_1.default.boolean().required(),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync(typeOrmModuleOptions),
            auth_module_1.AuthModule,
            card_module_1.CardModule,
            list_module_1.ListModule,
            comment_module_1.CommentModule,
            board_module_1.BoardModule,
            user_module_1.UserModule,
            workspace_module_1.WorkspaceModule,
            checklist_module_1.ChecklistModule,
            item_module_1.ItemModule,
            file_module_1.FileModule,
            member_module_1.MemberModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map