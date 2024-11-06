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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const workspace_entity_1 = require("../../workspace/entities/workspace.entity");
let Member = class Member {
};
exports.Member = Member;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Member.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: false, name: 'created_at' }),
    __metadata("design:type", Date)
], Member.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: false, name: 'is_admin' }),
    __metadata("design:type", Boolean)
], Member.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.members),
    __metadata("design:type", user_entity_1.User)
], Member.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workspace_entity_1.WorkspaceEntity, (workspace) => workspace.members),
    __metadata("design:type", workspace_entity_1.WorkspaceEntity)
], Member.prototype, "workspace", void 0);
exports.Member = Member = __decorate([
    (0, typeorm_1.Entity)({
        name: 'member',
    })
], Member);
//# sourceMappingURL=member.entity.js.map