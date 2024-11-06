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
exports.ListService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const list_entity_1 = require("./entities/list.entity");
let ListService = class ListService {
    constructor(listRepository) {
        this.listRepository = listRepository;
    }
    create(createListDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const listCount = yield this.listRepository.count({
                where: { board: { id: createListDto.boardId } },
            });
            const list = this.listRepository.create(Object.assign(Object.assign({}, createListDto), { order: listCount + 1 }));
            return this.listRepository.save(list);
        });
    }
    findAll(boardId) {
        return `This action returns all list`;
    }
    findOne(id) {
        return `This action returns a #${id} list`;
    }
    update(id, updateListDto, user) {
        return `This action updates a #${id} list`;
    }
    remove(id, user) {
        return `This action removes a #${id} list`;
    }
};
exports.ListService = ListService;
exports.ListService = ListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(list_entity_1.ListEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ListService);
//# sourceMappingURL=list.service.js.map