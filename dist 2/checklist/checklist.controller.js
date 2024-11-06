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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistController = void 0;
const common_1 = require("@nestjs/common");
const checklist_service_1 = require("./checklist.service");
const create_checklist_dto_1 = require("./dto/create-checklist.dto");
const update_checklist_dto_1 = require("./dto/update-checklist.dto");
let ChecklistController = class ChecklistController {
    constructor(checklistService) {
        this.checklistService = checklistService;
    }
    create(createChecklistDto) {
        return this.checklistService.create(createChecklistDto);
    }
    findAll() {
        return this.checklistService.findAll();
    }
    findOne(id) {
        return this.checklistService.findOne(+id);
    }
    update(id, updateChecklistDto) {
        return this.checklistService.update(+id, updateChecklistDto);
    }
    remove(id) {
        return this.checklistService.remove(+id);
    }
};
exports.ChecklistController = ChecklistController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_checklist_dto_1.CreateChecklistDto]),
    __metadata("design:returntype", void 0)
], ChecklistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChecklistController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChecklistController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_checklist_dto_1.UpdateChecklistDto]),
    __metadata("design:returntype", void 0)
], ChecklistController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChecklistController.prototype, "remove", null);
exports.ChecklistController = ChecklistController = __decorate([
    (0, common_1.Controller)('checklist'),
    __metadata("design:paramtypes", [checklist_service_1.ChecklistService])
], ChecklistController);
//# sourceMappingURL=checklist.controller.js.map