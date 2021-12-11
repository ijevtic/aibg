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

function getValueType(tr:Polje):ValueType{
    let {entity, tileType} = tr;
    let ret:ValueType = {entity, tileType};
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

function kopnoPolje(tr: Polje, mapa: Map<number, ValueType>): boolean{
    if(!poljeUMapi(tr)) return false;
    let kljuc: number = napraviHash(tr);
    if(!mapa.has(kljuc)) return false;
    return mapa.get(kljuc).tileType == "ISLAND";
}

function napraviPolje(q: number, r: number, s: number, entity: Entity, tileType: string): Polje{
    let polje: Polje = {q,r,s,entity, tileType};
    return polje;
}

function probajSusedni(q: number, r: number, s: number, mapa: Map<number, ValueType>,
     kopno:boolean): boolean{
    let polje: Polje = napraviPolje(q,r,s,null, null);
    if(kopno) return kopnoPolje(polje, mapa);
    return prohodnoPolje(polje, mapa,);
}

function dobij_susedne(tr: Polje, mapa: Map<number, ValueType>, kopno:boolean): Polje[]{
    let niz: Polje[] = [];
    for(let i = 0; i < 6; i++){
        if(probajSusedni(tr.q + nextP[i][0], tr.r + nextP[i][1], tr.s + nextP[i][2], mapa, kopno))
            niz.push(napraviPolje(tr.q + nextP[i][0], tr.r + nextP[i][1], tr.s + nextP[i][2], null, null));
    }
    return niz;
}

function najPolje(tr:Polje, mapaDist:Map<number, number>, mapa: Map<number, ValueType>,
    najblize: boolean, kopno:boolean): Polje{
    let susedni: Polje[] = dobij_susedne(tr,mapa, kopno);
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
    }
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

function bfsKopno(poc:Polje, mapa: Map<number, ValueType>): Polje[]{
    let mapaDist: Map<number, number> = new Map<number, number>();
    let nizPoc: Polje[] = [];
    let d = 0;
    nizPoc[d++] = poc;
    let qu: Polje[] = [];
    let br = 0;
    qu.push(poc);
    let duz = 1;
    mapaDist.set(napraviHash(poc), 0);
    while(br < duz) {
        let tr = qu[br++];
        let susedni: Polje[] = dobij_susedne(tr, mapa, true);
        for(let i = 0; i < susedni.length; i++){
            let kljuc:number = napraviHash(susedni[i]);
            if(!mapaDist.has(kljuc) && kopnoPolje(susedni[i], mapa)) {
                qu[duz++] = susedni[i];
                mapaDist.set(kljuc, 0);
                nizPoc[d++] = susedni[i];
            }
        }
    }
    return nizPoc;
}

function bfs(nizPolja: Polje[], mapa: Map<number, ValueType>): Map<number, number>{
    let mapaDist: Map<number, number> = new Map<number, number>();
    let qu: Polje[] = nizPolja;
    let duz = qu.length;
    let br = 0;
    for(let i = 0; i < qu.length; i++)
        mapaDist.set(napraviHash(qu[i]),0);
    while(br < duz) {
        let tr = qu[br++];
        let susedni: Polje[] = dobij_susedne(tr, mapa, false);
        // console.log(JSON.stringify(susedni))
        for(let i = 0; i < susedni.length; i++) {
            let kljuc:number = napraviHash(susedni[i]);
            if(!mapaDist.has(kljuc) && prohodnoPolje(susedni[i], mapa))
            {
                let closest: Polje = najPolje(susedni[i], mapaDist, mapa, true, false);
                mapaDist.set(kljuc, dobijDist(closest,mapaDist,true)+1);
                qu[duz++] = susedni[i];
                // console.log(br + " " + duz);
            }
        }
    }
    return mapaDist;
}


function idi_pravo_ka_polju(tr: Polje, cilj: Polje, mapa: Map<number, ValueType>):Polje{
    let nizCilj: Polje[] = [];
    nizCilj[0] = cilj;
    let distMapa: Map<number, number> = bfs(nizCilj, mapa);
    let polje: Polje = najPolje(tr, distMapa, mapa, true, false);
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
    let nizPolja: Polje[] = bfsKopno(zastava,mapa);
    let distMapa: Map<number, number> = bfs(nizPolja, mapa);
    let polje: Polje = najPolje(tr, distMapa, mapa, true, false);
    console.log("distanca" + dobijDist(polje, distMapa, true))
    return polje;
    return idi_pravo_ka_polju(tr, zastava, mapa);
}

function bezi_od_polja(tr: Polje, ne_cilj: Polje, mapa: Map<number, ValueType>): Polje{
    let nizCilj: Polje[] = [];
    nizCilj[0] = ne_cilj;
    let distMapa: Map<number, number> = bfs(nizCilj, mapa);
    let polje: Polje = najPolje(tr, distMapa, mapa, false, false);
    // console.log("distanca" + dobijDist(polje, distMapa))
    return polje
}

function najbliza_prodavnica(tr: Polje, mapa: Map<number, ValueType>): Polje{
    let nizCilj: Polje[] = [];
    nizCilj[0] = tr;
    let distMapa: Map<number, number> = bfs(nizCilj, mapa);
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

// function drawMap(mapaVidljivih : Map<number, ValueType>, nasaMapa : Map<number, ValueType>):void{
//     mapaVidljivih.forEach((value:ValueType, key: number) => {
//         const {q, r, s, entity, tileType}  = element;
//         const kljuc:number = napraviHash({q, r, s, entity, tileType});
//         const vrednost:ValueType = {entity, tileType};
//         if(!nasaMapa.has(kljuc)){
//             nasaMapa.set(kljuc,vrednost);
//             drawFromSymmetry(element, nasaMapa);
//         }
//     });
// }

function drawFromSymmetry(polje : Polje, nasaMapa : Map<number, ValueType>):void{

}

// function generateNextMove(tr: Polje, mapa: Map<KeyType, ValueType>): Polje{
// }

zastava = napraviPolje(0,-2,2,null, null);
let p1: Polje = napraviPolje(1,-2,1,null, "ISLAND");
let p2: Polje = napraviPolje(1,-1,0,null, "ISLAND");
let p3: Polje = napraviPolje(1,0,-1,null, "ISLAND");
let p4: Polje = napraviPolje(1,1,-2,null, "ISLAND");
let p5: Polje = napraviPolje(0,2,-2,null, "ISLAND");
let mapa : Map<number, ValueType> = new Map<number, ValueType>();
mapa.set(napraviHash(p1), getValueType(p1))
mapa.set(napraviHash(p2), getValueType(p2))
mapa.set(napraviHash(p3), getValueType(p3))
mapa.set(napraviHash(p4), getValueType(p4))
mapa.set(napraviHash(p5), getValueType(p5))
function testMetoda(){
    let igrac:Polje = napraviPolje(-1,2,-1,null,null)
    // let meta = napraviPolje(0,3,-3,null,null)
    while(napraviHash(igrac) != napraviHash(zastava))
    {
        let sl:Polje = idi_ka_zastavi(igrac, mapa)
        igrac = sl
        console.log("q:"+sl.q+" r:" + sl.r + " s:"+ sl.s)
    }
}

testMetoda()
// let mapa: Map<KeyType,boolean> = new Map<KeyType,boolean>();
// mapa.set(getKeyType(napraviPolje(-2,-2,0, null, null)), true);
// if(!mapa.has(getKeyType(napraviPolje(-2,-2,0, null, null))))
//     console.log("jebem ti mamu")
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
