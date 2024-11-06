import { Member } from './entity/member.entity';
import { Repository } from 'typeorm';
export declare class MemberService {
    private memberRepository;
    constructor(memberRepository: Repository<Member>);
    memberCreate(): Promise<void>;
}
