import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { User } from 'src/user/entities/user.entity';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    findOne(workspaceId: number): Promise<import("./entities/workspace.entity").WorkspaceEntity>;
    findAll(): Promise<import("./entities/workspace.entity").WorkspaceEntity[]>;
    workspaceCreate(createWorkspaceDto: CreateWorkspaceDto): Promise<import("./entities/workspace.entity").WorkspaceEntity>;
    addWorkspaceMember(user: User, workspaceId: number, addWorkspaceMemberDto: AddWorkspaceMemberDto): Promise<{
        status: number;
        message: string;
    }>;
}
