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
exports.BoardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lodash_1 = __importDefault(require("lodash"));
const typeorm_2 = require("typeorm");
const board_entity_1 = require("./entities/board.entity");
let BoardService = class BoardService {
    constructor(boardRepository) {
        this.boardRepository = boardRepository;
    }
    create(createBoardDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = this.boardRepository.create(Object.assign(Object.assign({}, createBoardDto), { userId: user.id }));
            return yield this.boardRepository.save(board);
        });
    }
    findAll(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const boards = yield this.boardRepository.find({
                select: ['id', 'name', 'backgroundColor', 'description'],
            });
            return { boards };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield this.boardRepository.findOne({
                where: { id },
            });
            if (!board) {
                throw new common_1.NotFoundException('보드를 찾을 수 없습니다.');
            }
            return board;
        });
    }
    update(id, updateBoardDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyBoardByUserId(user.id, id);
            const existingBoard = yield this.findOne(id);
            yield this.boardRepository.update(id, updateBoardDto);
            return Object.assign(Object.assign({}, existingBoard), updateBoardDto);
        });
    }
    remove(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyBoardByUserId(user.id, id);
            yield this.boardRepository.delete(id);
            return { message: '보드가 성공적으로 삭제되었습니다.' };
        });
    }
    verifyBoardByUserId(userId, boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield this.boardRepository.findOneBy({ userId: userId, id: boardId });
            if (lodash_1.default.isNil(board)) {
                throw new common_1.BadRequestException('해당 유저가 생성한 보드가 아닙니다.');
            }
            return board;
        });
    }
};
exports.BoardService = BoardService;
exports.BoardService = BoardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(board_entity_1.BoardEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BoardService);
//# sourceMappingURL=board.service.js.map