import { WorkspaceEntity } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { User } from 'src/user/entities/user.entity';
import { Member } from 'src/member/entity/member.entity';
export declare class WorkspaceService {
    private workspaceRepository;
    private readonly userRepository;
    private readonly memberRepository;
    constructor(workspaceRepository: Repository<WorkspaceEntity>, userRepository: Repository<User>, memberRepository: Repository<Member>);
    workspaceCreate(createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceEntity>;
    getAllWorkspace(): Promise<WorkspaceEntity[]>;
    getWorkspaceById(workspaceId: number): Promise<WorkspaceEntity>;
    addWorkspaceMember(user: User, workspaceId: number, userId: number): Promise<{
        status: number;
        message: string;
    }>;
    private verifyWorkspaceById;
}
