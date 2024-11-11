import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { MemberEntity } from './entity/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async switch(user: UserEntity, workspaceId: number, userId: number) {
    try {
      const myAuth = await this.memberRepository.findOne({
        where: { user: { id: user.id }, workspace: { id: workspaceId } },
      });

      console.log(myAuth);

      if (myAuth.isAdmin === false) {
        throw new UnauthorizedException('admin만 사용할 수 있는 기능입니다.');
      }

      const members = await this.memberRepository.find({
        where: { workspace: { id: workspaceId } },
      });

      if (user.id === userId) {
        const admins = members.filter((member) => member.isAdmin === true);
        if (admins.length === 1) {
          throw new ConflictException(
            '해당 워크스페이스의 유일한 admin으로 권한 변경을 할 수 없습니다.',
          );
        }
      }

      const member = await this.memberRepository.findOne({
        where: { workspace: { id: workspaceId }, user: { id: userId } },
      });

      console.log(member);
      let value: boolean;
      member.isAdmin === true ? (value = false) : (value = true);
      await this.memberRepository.update({ id: member.id }, { isAdmin: value });

      return {
        message: '권한을 변경하였습니다.',
      };
    } catch (err) {
      throw err;
    }
  }
}
