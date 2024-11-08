import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RemoveUserDto } from './dto/remove.dto';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { MemberEntity } from '../member/entity/member.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  // TODO : 비밀번호만 변경하는 경우인데 닉네임 중복 예외처리에 걸림
  async update(user: UserEntity, userUpdateDto: UpdateUserDto) {
    const target = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (userUpdateDto.nickname) {
      const isNicknameExists = await this.userRepository.findOne({
        where: { nickname: userUpdateDto.nickname },
      });

      if (isNicknameExists) {
        throw new ConflictException('이미 사용 중인 닉네임입니다. 다시 시도해주세요.');
      }
    }


    const updateData: Partial<UserEntity> = {};

    if (userUpdateDto.nickname) {
      updateData.nickname = userUpdateDto.nickname;
    }

    if (userUpdateDto.password) {
      updateData.password = await bcrypt.hash(userUpdateDto.password, 10);
    }

    // 변경된 값이 포함된 객체로 한 번에 업데이트
    await this.userRepository.update(user.id, updateData);

    return {
      statusCode: 200,
      message: '수정이 완료되었습니다.',
    };
  }

  async remove(user: UserEntity, removeUserDto: RemoveUserDto) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const findUser = await this.userRepository.findOne({
          where: { id: user.id },
        });
        const findMembers = await this.memberRepository.find({
          where: {
            user: { id: user.id },
          },
        });

        // 멤버가 어드민 일 시 탈퇴 불가
        findMembers.forEach((member) => {
          if (member.isAdmin === true) {
            throw new ConflictException('1개 이상 워크 스페이스에서 관리자 이므로 탈퇴할 수 없습니다.');
          }
        });


        if (!(await compare(removeUserDto.password, findUser.password))) {
          throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }

        await manager.getRepository(UserEntity).softDelete({
          id: user.id,
        });

        await manager.getRepository(MemberEntity).delete({
          user: { id: user.id },
        });

        return {
          statusCode: 200,
          message: '계정이 성공적으로 삭제 되었습니다.',
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

  }
}
