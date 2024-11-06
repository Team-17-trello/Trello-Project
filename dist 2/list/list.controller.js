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
exports.ListController = void 0;
const common_1 = require("@nestjs/common");
const create_list_dto_1 = require("./dto/create-list.dto");
const update_list_dto_1 = require("./dto/update-list.dto");
const list_service_1 = require("./list.service");
const passport_1 = require("@nestjs/passport");
const userInfo_decolator_1 = require("../utils/userInfo-decolator");
const user_entity_1 = require("../user/entities/user.entity");
let ListController = class ListController {
    constructor(listService) {
        this.listService = listService;
    }
    create(createListDto, user) {
        return this.listService.create(createListDto, user);
    }
    findAll(boardId) {
        return this.listService.findAll(boardId);
    }
    findOne(listId) {
        return this.listService.findOne(listId);
    }
    update(listId, updateListDto, user) {
        return this.listService.update(listId, updateListDto, user);
    }
    remove(listId, user) {
        return this.listService.remove(listId, user);
    }
};
exports.ListController = ListController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, userInfo_decolator_1.UserInfo)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_list_dto_1.CreateListDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':boardId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('boardId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':listId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('listId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':listId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('listId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, userInfo_decolator_1.UserInfo)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_list_dto_1.UpdateListDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':listId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('listId', common_1.ParseIntPipe)),
    __param(1, (0, userInfo_decolator_1.UserInfo)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ListController.prototype, "remove", null);
exports.ListController = ListController = __decorate([
    (0, common_1.Controller)('lists'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [list_service_1.ListService])
], ListController);
//# sourceMappingURL=list.controller.js.map