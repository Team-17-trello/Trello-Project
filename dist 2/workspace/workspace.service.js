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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const workspace_entity_1 = require("./entities/workspace.entity");
const typeorm_2 = require("typeorm");
const lodash_1 = __importDefault(require("lodash"));
const user_entity_1 = require("../user/entities/user.entity");
const member_entity_1 = require("../member/entity/member.entity");
let WorkspaceService = class WorkspaceService {
    constructor(workspaceRepository, userRepository, memberRepository) {
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
    }
    workspaceCreate(createWorkspaceDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspaceName } = createWorkspaceDto;
            const newWorkspace = this.workspaceRepository.create({ workspaceName });
            try {
                const saveWorkspace = yield this.workspaceRepository.save(newWorkspace);
                const createMember = yield this.memberRepository.create({
                    isAdmin: true,
                });
                yield this.memberRepository.save(createMember);
                return saveWorkspace;
            }
            catch (error) {
                throw new common_1.BadRequestException('워크스페이스 생성 중 오류가 발생했습니다.');
            }
        });
    }
    getAllWorkspace() {
        return __awaiter(this, void 0, void 0, function* () {
            const getWorkspace = yield this.workspaceRepository.find();
            if (getWorkspace.length === 0) {
                throw new common_1.BadRequestException('등록된 워크스페이스가 없습니다.');
            }
            return getWorkspace;
        });
    }
    getWorkspaceById(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyWorkspaceById(workspaceId);
            const getOneWorkspace = yield this.workspaceRepository.findOne({
                where: { id: workspaceId },
            });
            return getOneWorkspace;
        });
    }
    addWorkspaceMember(user, workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ where: { id: userId } });
            if (!foundUser) {
                throw new common_1.NotFoundException(`해당 ID(${userId})의 사용자가 존재하지 않습니다.`);
            }
            const foundWorkspace = yield this.workspaceRepository.findOne({
                where: { id: workspaceId },
                relations: ['members'],
            });
            if (!foundWorkspace) {
                throw new common_1.NotFoundException(`해당 ID(${workspaceId})의 워크스페이스가 존재하지 않습니다.`);
            }
            const foundAdminMember = yield this.memberRepository.findOne({
                where: { workspace: { id: workspaceId }, user: { id: user.id }, isAdmin: true },
            });
            if (!foundAdminMember) {
                throw new common_1.ForbiddenException(`해당 워크스페이스에 멤버를 추가할 권한이 없습니다.`);
            }
            if (foundWorkspace.members.some((member) => member.user.id === userId)) {
                throw new common_1.ConflictException(`해당 유저(${userId})는 이미 워크스페이스에 속해 있습니다.`);
            }
            const newMember = new member_entity_1.Member();
            newMember.user = foundUser;
            newMember.isAdmin = false;
            newMember.workspace = foundWorkspace;
            foundWorkspace.members.push(newMember);
            yield this.workspaceRepository.save(foundWorkspace);
            return { status: 200, message: '멤버를 성공적으로 초대했습니다.' };
        });
    }
    verifyWorkspaceById(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield this.workspaceRepository.findOneBy({ id: workspaceId });
            if (lodash_1.default.isNil(workspace)) {
                throw new common_1.BadRequestException('존재하지 않는 워크스페이스 입니다.');
            }
            return workspace;
        });
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workspace_entity_1.WorkspaceEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(member_entity_1.Member)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map