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