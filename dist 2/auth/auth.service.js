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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const bcrypt_1 = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    signup(signUpDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: {
                    email: signUpDto.email,
                },
            });
            if (user) {
                throw new common_1.ConflictException('이미 사용중인 이메일입니다. 다시 시도 해주세요');
            }
            if (signUpDto.password !== signUpDto.confirmedPassword) {
                throw new common_1.BadRequestException('비밀번호가 일치하지 않습니다. 확인해주세요.');
            }
            const isNicknameExists = yield this.userRepository.findOne({
                where: {
                    nickname: signUpDto.nickname,
                },
            });
            if (isNicknameExists) {
                throw new common_1.ConflictException('이미 사용중인 닉네임입니다. 다시 시도 해주세요');
            }
            const hashedPassword = yield bcrypt.hash(signUpDto.password, 10);
            yield this.userRepository.save({
                email: signUpDto.email,
                password: hashedPassword,
                nickname: signUpDto.nickname,
            });
            return '회원가입에 성공했습니다!';
        });
    }
    login(loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.userRepository.findOne({
                    where: { email: loginDto.email }
                });
                if (!findUser) {
                    throw new common_1.UnauthorizedException('존재하지 않는 사용자 입니다. 회원 가입을 진행해 주세요.');
                }
                if (!(yield (0, bcrypt_1.compare)(loginDto.password, findUser.password))) {
                    throw new common_1.UnauthorizedException('비밀 번호가 일치 하지 않습니다.');
                }
                const payload = { email: loginDto.email, sub: findUser.id };
                const token = this.jwtService.sign(payload);
                return {
                    statusCode: 200,
                    access_token: token,
                };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map