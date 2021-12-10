import { Polje, ValueType, Entity, KeyType, nextP } from "./types";

let zastava: Polje = null;

function poljeUMapi(tr: Polje): boolean{
    return Math.abs(tr.q) <= 14
         && Math.abs(tr.r) <= 14 
         && Math.abs(tr.s) <= 14;
}

function poljeUMapiKoor(q: number, r: number, s: number): boolean{
    return poljeUMapi(napraviPolje(q,r,s, null, null));
}

function getKeyType(tr:Polje):KeyType{
    let ret : KeyType;
    ret.q = tr.q;
    ret.r = tr.r;
    ret.s = tr.s;
    return ret;
}

function prohodnoPolje(tr: Polje, mapa: Map<KeyType, ValueType>): boolean{
    if(!poljeUMapi(tr)) return false;
    let kljuc: KeyType = getKeyType(tr);
    if(!mapa.has(kljuc)) return true;
    return mapa.get(kljuc).entity == null;
}

function napraviPolje(q: number, r: number, s: number, entity: Entity, tileType: string): Polje{
    let polje: Polje = {q,r,s,entity, tileType};
    return polje;
}

function probajSusedni(q: number, r: number, s: number, mapa: Map<KeyType, ValueType>): boolean{
    let polje: Polje = napraviPolje(q,r,s,null, null);
    return prohodnoPolje(polje, mapa);
}

function dobij_susedne(tr: Polje, mapa: Map<KeyType, ValueType>): Polje[]{
    let niz: Polje[] = [];
    for(let i = 0; i < 6; i++)
        if(probajSusedni(tr.q + nextP[i][0], tr.r + nextP[i][1], tr.s + nextP[i][2], mapa))
            niz.push(napraviPolje(tr.q + nextP[i][0], tr.r + nextP[i][1], tr.s + nextP[i][2], null, null));
    return niz;
}

function najPolje(tr:Polje, mapaDist:Map<KeyType, number>, mapa: Map<KeyType, ValueType>,
    najblize: boolean): Polje{
    let susedni: Polje[] = dobij_susedne(tr,mapa);
    let res:Polje = null;
    let best:number = 0;
    if(najblize)
        best = 10000;
    for(let i = 0; i < susedni.length; i++){
        let kljuc: KeyType = getKeyType(susedni[i]);
        if((najblize && mapaDist.has(kljuc) && mapaDist.get(kljuc) < best) ||
        ((!najblize && mapaDist.has(kljuc) && mapaDist.get(kljuc) > best)))
        if(mapaDist.has(kljuc) && mapaDist.get(kljuc) < best){
            best = mapaDist.get(kljuc);
            res = susedni[i];
        }
    }
    return res;
}

function dobijDist(tr:Polje, mapaDist: Map<KeyType, number>): number{
    if(tr == null || !mapaDist.has(getKeyType(tr))) return 10000;
    return mapaDist.get(getKeyType(tr));
}

function bfs(poc: Polje, mapa: Map<KeyType, ValueType>): Map<KeyType, number>{
    let mapaDist: Map<KeyType, number> = new Map<Polje, number>();
    let qu: Polje[] = [];
    let br = 0;
    qu.push(poc);
    mapaDist.set(getKeyType(poc), 0);
    while(br < qu.length) {
        br++;
        let tr = qu[br];
        let susedni: Polje[] = dobij_susedne(tr, mapa);
        for(let i = 0; i < susedni.length; i++) {
            let kljuc:KeyType = getKeyType(susedni[i]);
            if(!mapaDist.get(kljuc) && prohodnoPolje(susedni[i], mapa))
            {
                let closest: Polje = najPolje(susedni[i], mapaDist, mapa, true);
                mapaDist.set(kljuc, dobijDist(closest,mapaDist)+1);
                qu[br++] = susedni[i];
            }
        }
    }
    return mapaDist;
}

function idi_pravo_ka_polju(tr: Polje, cilj: Polje, mapa: Map<KeyType, ValueType>):Polje{
    let distMapa: Map<KeyType, number> = bfs(cilj, mapa);
    return najPolje(tr, distMapa, mapa, true);
}

function idi_ka_zastavi(tr: Polje, mapa: Map<KeyType, ValueType>): Polje{
    return idi_pravo_ka_polju(tr, zastava, mapa);
}

function bezi_od_polja(tr: Polje, ne_cilj: Polje, mapa: Map<KeyType, ValueType>): Polje{
    let distMapa: Map<KeyType, number> = bfs(ne_cilj, mapa);
    return najPolje(tr, distMapa, mapa, false);
}


// function generateNextMove(tr: Polje, mapa: Map<KeyType, ValueType>): Polje{
// }