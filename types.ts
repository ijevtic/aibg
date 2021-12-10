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

export class Avatar{
    _id : string;
    _health : number;
    _maxHealth: number;
    _money : number;
    _q : number;
    _r : number;
    _s : number;
    _cannons : number;
    _paralysed : boolean;
    _whirlPoolDuration : number;
    _potNums : number;
    _illegalMoves : number;
    _sight : number;
    
    public constructor(res){
        this._id = res.id;
        this._health = res.health;
        this._maxHealth = res.maxHealth;
        this._money = res.money;
        this._q = res.q;
        this._r = res.r;
        this._s = res.s;
        this._cannons = res.cannons;
        this._paralysed = res.paralyzed;
        this._whirlPoolDuration = res.whirlPoolDuration;
        this._potNums = res.potNums;
        this._illegalMoves = res.illegalMoves;
        this._sight = res.sight;
    }
}