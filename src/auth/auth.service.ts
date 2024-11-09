import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { Code, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { sign } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}
  async signup(signUpDto: SignupDto) {
    const email = signUpDto.email;
    const code = signUpDto.code;
    try {
      const checkCode = await this.verifyCode(email, code);
      if (checkCode === false) {
        throw new BadRequestException('인증 코드가 일치 하지 않습니다.');
      }

      const user = await this.userRepository.findOne({
        where: {
          email: signUpDto.email,
        },
      });
      if (user) {
        throw new ConflictException('이미 사용중인 이메일입니다. 다시 시도 해주세요');
      }

      if (signUpDto.password !== signUpDto.confirmedPassword) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다. 확인해주세요.');
      }

      const isNicknameExists = await this.userRepository.findOne({
        where: {
          nickname: signUpDto.nickname,
        },
      });

      if (isNicknameExists) {
        throw new ConflictException('이미 사용중인 닉네임입니다. 다시 시도 해주세요');
      }

      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

      await this.userRepository.save({
        email: signUpDto.email,
        password: hashedPassword,
        nickname: signUpDto.nickname,
      });

      return { message: '회원가입에 성공했습니다!' };
    } catch (err) {
      throw err;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });
      if (!findUser) {
        throw new UnauthorizedException('존재하지 않는 사용자 입니다. 회원 가입을 진행해 주세요.');
      }

      if (!(await compare(loginDto.password, findUser.password))) {
        throw new UnauthorizedException('비밀 번호가 일치 하지 않습니다.');
      }

      const payload = { email: loginDto.email, sub: findUser.id };
      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
      };
    } catch (err) {
      throw err;
    }
  }

  private async verifyCode(email, code) {
    const storedCode = await this.redisService.get(email);
    
    return storedCode === code;
  }
}

//바디 이메일,code
//레디스에서 이메일 찾아
// 찾은 이메일에서 code를 뽑음
// 뽑은코드랑 바디.code랑 일치하는지 비교
// JTy48Q3LflcpXIBMCjkl3al9q2FmOJ5h
// redis-16517.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com