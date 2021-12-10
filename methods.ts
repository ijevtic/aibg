import { Polje, ValueType, Entity, KeyType } from "./types";

function poljeUMapi(tr: Polje): boolean{
    return Math.abs(tr.q) <= 14
         && Math.abs(tr.r) <= 14 
         && Math.abs(tr.s) <= 14;
}

function poljeUMapiKoor(q: number, r: number, s: number): boolean{
    return poljeUMapi(napraviPolje(q,r,s, null, null));
}

function prohodnoPolje(tr: Polje, mapa: Map<Polje>): boolean{
    if(!poljeUMapi(tr)) return false;
    if()
}

// function getEntity(mapa: Map<Polje, string>)

// function slobodnoPolje(tr: Polje):


function napraviPolje(q: number, r: number, s: number, entity: Entity, tileType: string): Polje{
    let polje: Polje = {q,r,s,entity, tileType};
    return polje;
}

function dobij_susedne(tr: Polje): Polje[]{
    let niz: Polje[] = [];
    let q:number = tr.q;
    let r:number = tr.r;
    let s:number = tr.s;
    if(poljeUMapiKoor(q-1,r+1,s,null, null)) niz.push(napraviPolje(q-1,r+1,s,null));
    if(poljeUMapiKoor(q+1,r-1,s,null)) niz.push(napraviPolje(q+1,r-1,s,null));
    if(poljeUMapiKoor(q-1,r,s+1,null)) niz.push(napraviPolje(q-1,r,s+1,null));
    if(poljeUMapiKoor(q+1,r,s-1,null)) niz.push(napraviPolje(q+1,r,s-1,null));
    if(poljeUMapiKoor(q,r+1,s-1)) niz.push(napraviPolje(q,r+1,s-1,null));
    if(poljeUMapiKoor(q,r-1,s+1)) niz.push(napraviPolje(q,r-1,s+1,null));
    return niz;
}

function dobij_najblizi(susedni: Polje[], mapa: Map<Polje, number>): number {
    let dist: number = Number.MAX_SAFE_INTEGER;
    for(let i=0; i<susedni.length; i++)
        if(mapa.has(susedni[i])) 
            dist = Math.min(dist, mapa.get(susedni[i]));
    return dist;
}

function bfs(poc: Polje): Map<Polje, number>{
    let mapa: Map<Polje, number> = new Map<Polje, number>();
    let qu: Polje[] = [];
    let br = 0;
    qu.push(poc);
    mapa.set(poc, 0);
    while(br < qu.length) {
        br++;
        let 
        let susedni: Polje[] = dobij_susedne(tr)
    }
}

function idi_pravo_ka_polju(tr: Polje, cilj: Polje, mapa: Map<Polje, String>):Polje{
    
}