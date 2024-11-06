import { Member } from '../../member/entity/member.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    nickname: string;
    createdAt: Date;
    deletedAt: Date | null;
    members: Member[];
}
