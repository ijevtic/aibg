import { Polje, ValueType, Entity, KeyType, nextP, Avatar } from "./types";

let zastava: Polje = null;
let prodavnice: Polje[] = [];

function poljeUMapi(tr: Polje): boolean{
    return Math.abs(tr.q) <= 14
         && Math.abs(tr.r) <= 14 
         && Math.abs(tr.s) <= 14;
}

function poljeUMapiKoor(q: number, r: number, s: number): boolean{
    return poljeUMapi(napraviPolje(q,r,s, null, null));
}

function getKeyType(tr:Polje):KeyType{
    let {q,r,s} = tr;

    let ret : KeyType={q,r,s};
    return ret;
}

function napraviHash(tr:Polje):number{
    return tr.q*100000 + tr.r*1000 + tr.s;
}

function prohodnoPolje(tr: Polje, mapa: Map<number, ValueType>): boolean{
    if(!poljeUMapi(tr)) return false;
    let kljuc: number = napraviHash(tr);
    if(!mapa.has(kljuc)) return true;
    return mapa.get(kljuc).entity == null;
}

function napraviPolje(q: number, r: number, s: number, entity: Entity, tileType: string): Polje{
    let polje: Polje = {q,r,s,entity, tileType};
    return polje;
}

function probajSusedni(q: number, r: number, s: number, mapa: Map<number, ValueType>): boolean{
    let polje: Polje = napraviPolje(q,r,s,null, null);
    return prohodnoPolje(polje, mapa);
}

function dobij_susedne(tr: Polje, mapa: Map<number, ValueType>): Polje[]{
    let niz: Polje[] = [];
    for(let i = 0; i < 6; i++){
        if(probajSusedni(tr.q + nextP[i][0], tr.r + nextP[i][1], tr.s + nextP[i][2], mapa))
            niz.push(napraviPolje(tr.q + nextP[i][0], tr.r + nextP[i][1], tr.s + nextP[i][2], null, null));
    }
    return niz;
}

function najPolje(tr:Polje, mapaDist:Map<number, number>, mapa: Map<number, ValueType>,
    najblize: boolean): Polje{
    let susedni: Polje[] = dobij_susedne(tr,mapa);
    let res:Polje = null;
    let best:number = -1;
    if(najblize)
        best = 10000;
    // console.log("trenutno polje" + JSON.stringify(tr));
    // console.log("ide lista susednih");
    // console.log(JSON.stringify(susedni));
    for(let i = 0; i < susedni.length; i++){
        let kljuc: number = napraviHash(susedni[i]);
        if((najblize && dobijDist(susedni[i], mapaDist, najblize) < best) ||
        ((!najblize && dobijDist(susedni[i], mapaDist, najblize) > best))){
            best = dobijDist(susedni[i], mapaDist, najblize);
            res = susedni[i];
        }
        if(napraviHash(susedni[i]) == napraviHash(napraviPolje(0,3,-3,null,null)))
        {
            console.log("!!!!!!!!!!!!!!!!");
            console.log(best);
            console.log(dobijDist(napraviPolje(0,3,-3,null,null), mapaDist, najblize));
        }
    }
    if(napraviHash(res) == napraviHash(napraviPolje(0,3,-3,null,null)))
        console.log("???????");
    return res;

}

function dobijDist(tr:Polje, mapaDist: Map<number, number>, najblize: boolean): number{
    if(tr == null || !mapaDist.has(napraviHash(tr)))
    {
        if(najblize) return 1000;
        return -1000;
    }
    return mapaDist.get(napraviHash(tr));
}

function bfs(poc: Polje, mapa: Map<number, ValueType>): Map<number, number>{
    let mapaDist: Map<number, number> = new Map<number, number>();
    let qu: Polje[] = [];
    let br = 0;
    qu.push(poc);
    let duz = 1;
    mapaDist.set(napraviHash(poc), 0);
    while(br < duz) {
        let tr = qu[br++];
        let susedni: Polje[] = dobij_susedne(tr, mapa);
        // console.log(JSON.stringify(susedni))
        for(let i = 0; i < susedni.length; i++) {
            let kljuc:number = napraviHash(susedni[i]);
            if(!mapaDist.has(kljuc) && prohodnoPolje(susedni[i], mapa))
            {
                if(napraviHash(susedni[i]) == napraviHash(poc))
                {
                    console.log("............................");
                }
                let closest: Polje = najPolje(susedni[i], mapaDist, mapa, true);
                mapaDist.set(kljuc, dobijDist(closest,mapaDist,true)+1);
                qu[duz++] = susedni[i];
                // console.log(br + " " + duz);
            }
        }
    }
    return mapaDist;
}


function idi_pravo_ka_polju(tr: Polje, cilj: Polje, mapa: Map<number, ValueType>):Polje{
    let distMapa: Map<number, number> = bfs(cilj, mapa);
    let polje: Polje = najPolje(tr, distMapa, mapa, true);
    console.log("distanca" + dobijDist(polje, distMapa, true))
    return polje;
}

function vratiZastavu(response):Polje{
    return response.currFlag;
}

export function mapaVidljivihPolja(response):Map<number, ValueType>{
    const mapa:Map<number,ValueType> = new Map<number,ValueType>();
    const listaPolja = response.map.tiles.flat();
    const samoVidljiva = listaPolja.filter(cur => Object.keys(cur).length !== 0);
    samoVidljiva.forEach((element: Polje) => {
        const {q, r, s, entity, tileType}  = element;
        const kljuc:number = napraviHash({q, r, s, entity, tileType});
        const vrednost:ValueType = {entity, tileType};
        mapa.set(kljuc,vrednost);
    });
    return mapa;
}

function idi_ka_zastavi(tr: Polje, mapa: Map<number, ValueType>): Polje{
    return idi_pravo_ka_polju(tr, zastava, mapa);
}

function bezi_od_polja(tr: Polje, ne_cilj: Polje, mapa: Map<number, ValueType>): Polje{
    let distMapa: Map<number, number> = bfs(ne_cilj, mapa);
    let polje: Polje = najPolje(tr, distMapa, mapa, false);
    // console.log("distanca" + dobijDist(polje, distMapa))
    return polje
}

function najbliza_prodavnica(tr: Polje, mapa: Map<number, ValueType>): Polje{
    let distMapa: Map<number, number> = bfs(tr, mapa);
    let najbliza: Polje = null;
    let dist = 100;
    for(let i = 0; i < prodavnice.length; i++){
        if(dobijDist(prodavnice[i], distMapa, true) < dist){
            najbliza = prodavnice[i];
            dist = dobijDist(prodavnice[i], distMapa, true);
        }
    }
    return idi_pravo_ka_polju(tr, najbliza, mapa);
}
function getKeyTypeKoor(q: number, r: number, s:number) : KeyType{
    let k : KeyType;
    k.q = q;
    k.r = r;
    k.s = s;
    return k;
}


function scanForEnemies(otherPlayers: Avatar[], npcs: Avatar[], res) : void{
    if(res.player1){
        otherPlayers.push(new Avatar(res.player1));
    }
    if(res.player2){
        otherPlayers.push(new Avatar(res.player2));
    }
    if(res.player3){
        otherPlayers.push(new Avatar(res.player3));
    }
    if(res.player4){
        otherPlayers.push(new Avatar(res.player4));
    }
    if(res.npc1){
        npcs.push(new Avatar(res.npc1));
    }
    if(res.npc2){
        npcs.push(new Avatar(res.npc2));
    }
}

function initStartPostion(res, mapa : Map<number, Polje>){
    switch(res.id){
        case 1:
            mapa.set(napraviHash(napraviPolje(-7,-7,14, null, "NORMAL")), napraviPolje(-7,-7,14, null, "NORMAL"));
            break;
        case 2:
            mapa.set(napraviHash(napraviPolje(14,-7,-7, null, "NORMAL")), napraviPolje(14,-7,-7, null, "NORMAL"));
            break;
        case 3:
            mapa.set(napraviHash(napraviPolje(7,7,-14, null, "NORMAL")), napraviPolje(7,7,-14, null, "NORMAL"));
            break;
        case 4:
            mapa.set(napraviHash(napraviPolje(-14,7,7, null, "NORMAL")), napraviPolje(-14,7,7, null, "NORMAL"));
            break;    
        
    }
}

function drawMap(mapaVidljivih : Map<number, ValueType>, nasaMapa : Map<number, ValueType>):void{
    mapaVidljivih.forEach((element: Polje) => {
        const {q, r, s, entity, tileType}  = element;
        const kljuc:number = napraviHash({q, r, s, entity, tileType});
        const vrednost:ValueType = {entity, tileType};
        if(!nasaMapa.has(kljuc)){
            nasaMapa.set(kljuc,vrednost);
            drawFromSymmetry(element, nasaMapa);
        }
    });
}

function drawFromSymmetry(polje : Polje, nasaMapa : Map<number, ValueType>):void{

}

let igrac:Polje = napraviPolje(0,-3,3,null,null)
let meta = napraviPolje(0,3,-3,null,null)
while(napraviHash(igrac) != napraviHash(meta))
{
    let sl:Polje = idi_pravo_ka_polju(igrac, meta, new Map<number, ValueType>())
    igrac = sl
    console.log("q:"+sl.q+" r:" + sl.r + " s:"+ sl.s)
}

function getDirection(target, current) {
    var deltaQ = target.q - current.q;
    var deltaR = target.r - current.r;
    var deltaS = target.s - current.s;
    if (deltaQ == 0 && deltaS== 1 && deltaR == -1) {
        return "nw";
    }
    else if (deltaQ == -1 && deltaS == 1 && deltaR == 0) {
        return "w";
    }
    else if (deltaQ == -1 && deltaS == 0 && deltaR == 1) {
        return "sw";
    }
    else if (deltaQ == 0 && deltaS == -1 && deltaR == 1) {
        return "se";
    }
    else if (deltaQ == 1 && deltaS == -1 && deltaR == 0) {
        return "e";
    }
    else if (deltaQ == 1 && deltaS == 0 && deltaR == -1) {
        return "ne";
    }
    console.log("NEVALIDNA KOORDINATA!!!!!");
    return "";
}
