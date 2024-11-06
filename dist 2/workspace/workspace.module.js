"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceModule = void 0;
const common_1 = require("@nestjs/common");
const workspace_service_1 = require("./workspace.service");
const workspace_controller_1 = require("./workspace.controller");
const typeorm_1 = require("@nestjs/typeorm");
const workspace_entity_1 = require("./entities/workspace.entity");
const user_entity_1 = require("../user/entities/user.entity");
const member_entity_1 = require("../member/entity/member.entity");
let WorkspaceModule = class WorkspaceModule {
};
exports.WorkspaceModule = WorkspaceModule;
exports.WorkspaceModule = WorkspaceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([workspace_entity_1.WorkspaceEntity, user_entity_1.User, member_entity_1.Member])],
        providers: [workspace_service_1.WorkspaceService],
        controllers: [workspace_controller_1.WorkspaceController],
    })
], WorkspaceModule);
//# sourceMappingURL=workspace.module.js.map