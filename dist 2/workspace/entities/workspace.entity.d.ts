import { BaseEntity } from 'typeorm';
import { Member } from 'src/member/entity/member.entity';
export declare class WorkspaceEntity extends BaseEntity {
    id: number;
    workspaceName: string;
    createdAt: Date;
    members: Member[];
}
