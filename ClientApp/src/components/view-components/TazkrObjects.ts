export type User = {
    Id: string;
    UserName: string;
    Email: string;
    LastRequestTimeUTC: Date;
    Online: boolean;
}
export type TaskObj = {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    Description: string;
    Index: number;
}

export type Column = {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    Description: string;
    Index: number;
    Cards: TaskObj[];
}

export enum BoardPermissionLevel {
    Owner = "Owner",
    Viewer = "Viewer",
    User = "User"
};

export type Board = {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    CreatedDateUTC: Date;
    CreatedBy: User;
    Columns: Column[];
    BoardUsers: User[];
    PermissionLevel: BoardPermissionLevel;
    IsPubliclyVisible: boolean;
}

export type ChatMessage = {
    ChatId: string;
    UpdateHashCode: number;
    UserName : string;
    CreatedDateUTC : string;
    Message : string;    
}
