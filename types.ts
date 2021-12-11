export interface Polje{
    q: number,
    r: number,
    s: number,
    entity: Entity,
    tileType: string
}

export interface Entity{
    type: string
}

export interface ValueType{
    entity: Entity,
    tileType: string
}

export interface KeyType{
    q: number,
    r: number,
    s: number
}


export const nextP = [[-1,1,0], [1,-1,0],[1,0,-1],[-1,0,1],[0,1,-1],[0,-1,1]];


export interface Avatar{
    id : number;
    health : number;
    maxHealth: number;
    money : number;
    q : number;
    r : number;
    s : number;
    cannons : number;
    paralysed : boolean;
    whirlPoolDuration : number;
    potNums : number;
    illegalMoves : number;
    sight : number;
}