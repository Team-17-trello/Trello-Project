import { User } from '../../user/entities/user.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
export declare class Member {
    id: number;
    createdAt: Date;
    isAdmin: boolean;
    user: User;
    workspace: WorkspaceEntity;
}
