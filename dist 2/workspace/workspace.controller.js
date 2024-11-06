"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const workspace_service_1 = require("./workspace.service");
const create_workspace_dto_1 = require("./dto/create-workspace.dto");
const passport_1 = require("@nestjs/passport");
const user_entity_1 = require("../user/entities/user.entity");
const userInfo_decolator_1 = require("../utils/userInfo-decolator");
const add_workspace_member_dto_1 = require("./dto/add-workspace-member.dto");
let WorkspaceController = class WorkspaceController {
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    findOne(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.workspaceService.getWorkspaceById(workspaceId);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.workspaceService.getAllWorkspace();
        });
    }
    workspaceCreate(createWorkspaceDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.workspaceService.workspaceCreate(createWorkspaceDto);
        });
    }
    addWorkspaceMember(user, workspaceId, addWorkspaceMemberDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.workspaceService.addWorkspaceMember(user, workspaceId, addWorkspaceMemberDto.userId);
        });
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, common_1.Get)(':workspaceId'),
    __param(0, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workspace_dto_1.CreateWorkspaceDto]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "workspaceCreate", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)(':workspaceId/members'),
    __param(0, (0, userInfo_decolator_1.UserInfo)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, add_workspace_member_dto_1.AddWorkspaceMemberDto]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "addWorkspaceMember", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, common_1.Controller)('workspaces'),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map