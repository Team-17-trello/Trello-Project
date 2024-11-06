import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RemoveUserDto } from './dto/remove.dto';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async update(user: User, userUpdateDto: UpdateUserDto) {
    const target = await this.userRepository.findOne({
      where: { id: user.id },
    });

    const isNicknameExists = await this.userRepository.findOne({
      where: { nickname: userUpdateDto.nickname },
    });

    if (isNicknameExists) {
      throw new ConflictException('이미 사용 중인 닉네임입니다. 다시 시도해주세요.');
    }
    const updateData: Partial<User> = {};

    if (userUpdateDto.nickname) {
      updateData.nickname = userUpdateDto.nickname;
    }

    if (userUpdateDto.password) {
      updateData.password = await bcrypt.hash(userUpdateDto.password, 10);
    }

    // 변경된 값이 포함된 객체로 한 번에 업데이트
    return await this.userRepository.update(user.id, updateData);
  }

  async remove(user: User, removeUserDto: RemoveUserDto) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id: user.id },
      });

      if (!(await compare(removeUserDto.password, findUser.password))) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      await this.userRepository.update(findUser.id, {
        email: null,
        password: null,
        nickname: null,
        deletedAt: new Date(),
      });
      return {
        statusCode: 200,
        message: '계정이 성공적으로 삭제 되었습니다.',
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
