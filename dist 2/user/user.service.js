"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const bcrypt_1 = require("bcrypt");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    update(user, userUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = yield this.userRepository.findOne({
                where: { id: user.id },
            });
            const isNicknameExists = yield this.userRepository.findOne({
                where: { nickname: userUpdateDto.nickname },
            });
            if (isNicknameExists) {
                throw new common_1.ConflictException('이미 사용 중인 닉네임입니다. 다시 시도해주세요.');
            }
            const updateData = {};
            if (userUpdateDto.nickname) {
                updateData.nickname = userUpdateDto.nickname;
            }
            if (userUpdateDto.password) {
                updateData.password = yield bcrypt.hash(userUpdateDto.password, 10);
            }
            return yield this.userRepository.update(user.id, updateData);
        });
    }
    remove(user, removeUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.userRepository.findOne({
                    where: { id: user.id },
                });
                if (!(yield (0, bcrypt_1.compare)(removeUserDto.password, findUser.password))) {
                    throw new common_1.UnauthorizedException('비밀번호가 일치하지 않습니다.');
                }
                yield this.userRepository.update(findUser.id, {
                    email: null,
                    password: null,
                    nickname: null,
                    deletedAt: new Date(),
                });
                return {
                    statusCode: 200,
                    message: '계정이 성공적으로 삭제 되었습니다.',
                };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map