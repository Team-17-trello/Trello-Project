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
exports.SignupDto = void 0;
const class_validator_1 = require("class-validator");
class SignupDto {
}
exports.SignupDto = SignupDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)({ message: '이메일을 입력해주세요' }),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 16, { message: '비밀번호는 8자 이상이며 16글자 이하만 가능합니다.' }),
    (0, class_validator_1.IsNotEmpty)({ message: '비밀 번호를 입력해주세요.' }),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '확인 비밀 번호를 입력해주세요.' }),
    __metadata("design:type", String)
], SignupDto.prototype, "confirmedPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '닉네임을 입력해주세요.' }),
    __metadata("design:type", String)
], SignupDto.prototype, "nickname", void 0);
//# sourceMappingURL=signup.dto.js.map