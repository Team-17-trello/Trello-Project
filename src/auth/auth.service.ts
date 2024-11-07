import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {UserEntity} from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity)
              private readonly userRepository: Repository<UserEntity>,
              private readonly jwtService : JwtService) {
  }
  async signup (signUpDto: SignupDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });
    if (user) {
      throw new ConflictException('이미 사용중인 이메일입니다. 다시 시도 해주세요');
    }

    if(signUpDto.password !== signUpDto.confirmedPassword){
      throw new BadRequestException('비밀번호가 일치하지 않습니다. 확인해주세요.');
    }

    const isNicknameExists = await this.userRepository.findOne({
      where: {
        nickname: signUpDto.nickname,
      },
    });

    if(isNicknameExists){
      throw new ConflictException('이미 사용중인 닉네임입니다. 다시 시도 해주세요');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    await this.userRepository.save({
      email: signUpDto.email,
      password: hashedPassword,
      nickname: signUpDto.nickname,
    })


    return {message:'회원가입에 성공했습니다!'};
  }


  async login(loginDto : LoginDto){

    try{

      const findUser = await this.userRepository.findOne({
        where :{email : loginDto.email}
      })
      if(!findUser){
        throw new UnauthorizedException('존재하지 않는 사용자 입니다. 회원 가입을 진행해 주세요.')
      }

      if(!(await compare(loginDto.password, findUser.password))){
        throw new UnauthorizedException('비밀 번호가 일치 하지 않습니다.')
      }

      // 로그인 성공 시 토큰

      const payload = {email: loginDto.email, sub: findUser.id}
      const token = this.jwtService.sign(payload)

      return {
        statusCode:200,
        access_token: token,
      }


    }catch (error) {
        console.error(error)
        throw error
    }

  }

}
