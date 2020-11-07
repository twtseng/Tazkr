export interface User {
    Id: string;
    UserName: string;
    Email: string;
}
export interface Card {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    Description: string;
}

export interface Column {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    Description: string;
    Index: number;
    Cards: [Card];
}

export interface Board {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    CreatedDateUTC: Date;
    Columns: [Column];
    BoardUsers: [User];
}

