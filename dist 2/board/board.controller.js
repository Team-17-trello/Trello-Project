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
exports.BoardController = void 0;
const common_1 = require("@nestjs/common");
const board_service_1 = require("./board.service");
const create_board_dto_1 = require("./dto/create-board.dto");
const update_board_dto_1 = require("./dto/update-board.dto");
const passport_1 = require("@nestjs/passport");
const userInfo_decolator_1 = require("../utils/userInfo-decolator");
const user_entity_1 = require("../user/entities/user.entity");
let BoardController = class BoardController {
    constructor(boardService) {
        this.boardService = boardService;
    }
    create(createBoardDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.boardService.create(createBoardDto, user);
        });
    }
    findAll(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.boardService.findAll(workspaceId);
        });
    }
    findOne(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.boardService.findOne(boardId);
        });
    }
    update(boardId, updateBoardDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.boardService.update(boardId, updateBoardDto, user);
        });
    }
    remove(boardId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.boardService.remove(boardId, user);
        });
    }
};
exports.BoardController = BoardController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, userInfo_decolator_1.UserInfo)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_board_dto_1.CreateBoardDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':workspaceId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('workspaceId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':boardId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('boardId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':boardId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('boardId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, userInfo_decolator_1.UserInfo)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_board_dto_1.UpdateBoardDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':boardId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('boardId', common_1.ParseIntPipe)),
    __param(1, (0, userInfo_decolator_1.UserInfo)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "remove", null);
exports.BoardController = BoardController = __decorate([
    (0, common_1.Controller)('boards'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [board_service_1.BoardService])
], BoardController);
//# sourceMappingURL=board.controller.js.map