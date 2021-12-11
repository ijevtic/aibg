import { Polje, ValueType, Entity, KeyType, nextP, Avatar } from "./types";
import {MY_ID} from "./index"
import { response } from "express";

let zastava: Polje = null;
let prodavnice: Polje[] = [];
let igraci:Avatar[]=[];
let globalnaMapa: Map<number, ValueType> = new Map<number, ValueType>();
let igrac: Polje = null;
let cnt = 0;
let pare = 0;
let hull = 0;
let cannon = 0;
let moj_avatar:Avatar;

function je_kod_prodze():boolean{
    let hahaha = false;
    prodavnice.forEach(prodza => {
        if(su_susedi(prodza,igrac)){
            hahaha = true;;
        }
    })
    return hahaha;
}

export function najblizaProdavnicaMain(){
    return najbliza_prodavnica(igrac, globalnaMapa);
}

function dalKupujem(){
    if(hull==2 && cannon==2){
        return false;
    }
    if(pare>=300){
        if(hull!=2){
            return true;
        }
        else if(cannon!=2){
            return true;
        }
    }
    else if(pare>=200){
        if(hull==0){
            return true;
        }
        else if(cannon==0){
            return true;
        }
    }
    return false;
}

function staKupujem(){
    if(hull==2 && cannon==2){
        return -1;
    }
    if(pare>=300){
        if(hull!=2){
            hull++;
            return 3;
        }
        else if(cannon!=2){
            cannon++;
            return 4;
        }
    }
    else if(pare>=200){
        if(hull==0){
            hull++;
            return 3;
        }
        else if(cannon==0){
            cannon++;
            return 4;
        }
    }
    return -1;
}
let idNapada;
let idiHitno : Polje;

export function idiHitnoNegde():Polje{
    return idiHitno;
}

export function vratiIdNapada():number{
    return idNapada;
}
export function odlucivac():number{
    idNapada=dalNapadamo();
    if(idNapada!=-1){
        return 5;
    }
    let p: Polje = opasanNeprijateljUOkolini();
    if(p != null) {
        idiHitno = p;
        return 6;
    }
    if(je_kod_prodze()){
        const stakup = staKupujem();
        if(stakup!=-1){
            return stakup;
        }
    }
    // if(healovanje()){

    // }
    p = lakaMetaUOkolini();
    if(p != null){
        idiHitno = p;
        return 6;
    }
    if(dalKupujem() && prodavnice.length!=0){
        return 1;
    }
    return 2;
}

// function healovanje(){
//     if(moj_avatar.maxHealth != 1000 || moj_avatar.cannons != 250) return;
//     if(moj_avatar.health < moj_avatar.maxHealth/2) {
//         return
//     }
// }

function opasanNeprijateljUOkolini(): Polje{
    let lav:Polje[]=[];
    lav.push(igrac);
    let mapDist=bfsVazduh(lav);
    for(let player of igraci){
        if(dobijDist(napraviPoljeOdAvatara(player),mapDist,true)==3){
            if(odrediJacinuProtivnika(player) == 3)
            return bezi_od_polja(igrac, napraviPoljeOdAvatara(player), globalnaMapa);
        }
    }
    return null;
}

function lakaMetaUOkolini(): Polje{
    let lav:Polje[]=[];
    lav.push(igrac);
    let mapDist=bfsVazduh(lav);
    for(let player of igraci){
        if(dobijDist(napraviPoljeOdAvatara(player),mapDist,true)==3){
            if(odrediJacinuProtivnika(player) == 1)
                return idi_pravo_ka_polju(igrac, napraviPoljeOdAvatara(player), globalnaMapa);
        }
    }

}

function odrediJacinuProtivnika(player: Avatar): number{
    let hits: number = (player.health/moj_avatar.cannons+1)%moj_avatar.cannons;
    let damage: number = hits*player.cannons;
    if(damage * 2.5 < moj_avatar.health && moj_avatar.health - damage > 250)
        return 1;
    if(damage*1.3 >= moj_avatar.health || moj_avatar.health - damage < 200)
        return 3;
}

export function dalNapadamo(){
   let lav:Polje[]=[];
   lav.push(igrac);
   let mapDist=bfsVazduh(lav);
   for(let player of igraci){
       if(dobijDist(napraviPoljeOdAvatara(player),mapDist,true)<=2){
           return player.id;
       }
   }
   return -1;
}
function napraviPoljeOdAvatara(avatar:Avatar):Polje{
    let {q,r,s} = avatar;
    let polje:Polje={
        q: q,
        r: r,
        s: s,
        entity: null,
        tileType: null,
    }
    return polje;
}
export function updateGlobal(response){
    if(!response || !response.currFlag){
        console.log("LOSEEEEE");
        return;
    }
    zastava = response.currFlag;
    // console.log(zastava);
    const vidljivaPolja = listaVidljivihPolja(response);
    igraci = scanForEnemies(response);
    // console.log("ovo su igraci"+JSON.stringify(igraci));

    const filtriranaVidljiva = vidljivaPolja.filter(cur => true);
    // globalnaMapa = new Map<number, ValueType>();
    filtriranaVidljiva.forEach(element => {
        let nasao = false;
        prodavnice.forEach(prodza => {
            if(prodza.q == element.q && prodza.s == element.s && prodza.r == element.r){
                nasao = true;
            }
        });
        if(!nasao &&  element.entity!=null && element.entity.type == "ISLANDSHOP"){
            prodavnice.push(element);
        }
        if(globalnaMapa.has(napraviHash(element))){

            globalnaMapa.delete(napraviHash(element));
        }
        globalnaMapa.set(napraviHash(element),getValueType(element))
    });
    // console.log("!!!!!!!!");
    // console.log(JSON.stringify(globalnaMapa))
    const player = dobij_igraca(response);
    pare = player.money;
    igrac = napraviPolje(player.q, player.r, player.s, null, null);
}

function dobij_igraca(response){
    if(response.player1 && response.player1.id == MY_ID){
        moj_avatar = response.player1;
        console.log("ja sam igrac1");
        return response.player1;
    }
    if(response.player2 && response.player2.id == MY_ID){
        moj_avatar = response.player2;
        
        console.log("ja sam igrac2");
        return response.player2;
    }
    if(response.player3 && response.player3.id == MY_ID){
        moj_avatar = response.player2;
        
        console.log("ja sam igrac3");
        return response.player3;
    }
    if(response.player4 && response.player4.id == MY_ID){
        moj_avatar = response.player2;
        
        console.log("ja sam igrac4");
        return response.player4;
    }
    return response.player1;
}

export function idiKaZastaviMain(): Polje{
    return idi_ka_zastavi(igrac, globalnaMapa);
}

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

function probajSusedni(q: number, r: number, s: number, mapa: Map<number, ValueType>,kopno:boolean): boolean{
    let polje: Polje = napraviPolje(q,r,s,null, null);
    if(kopno) return kopnoPolje(polje, mapa);
    return prohodnoPolje(polje, mapa);
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
    // console.log(best);
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
    let d = 0;
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
                qu.push(susedni[i]);
                duz++;
                mapaDist.set(kljuc, 0);
            }
        }
    }
    return qu;
}

function bfs(nizPolja: Polje[], mapa: Map<number, ValueType>): Map<number, number>{
    let mapaDist: Map<number, number> = new Map<number, number>();
    let qu: Polje[] = nizPolja;
    let duz = qu.length;
    let br = 0;
    let praviD = 0;
    let praviM = 0;
    for(let i = 0; i < qu.length; i++)
        mapaDist.set(napraviHash(qu[i]),0);
    
        mapaDist.forEach((value: number, key: number) => {
            if(value != 0) praviM++;
        });
    while(br < duz) {
        let tr = qu[br++];
        let susedni: Polje[] = dobij_susedne(tr, mapa, false);
        // console.log(JSON.stringify(susedni))
        for(let i = 0; i < susedni.length; i++) {
            let kljuc:number = napraviHash(susedni[i]);
            if(!mapaDist.has(kljuc) && prohodnoPolje(susedni[i], mapa))
            {
                // let closest: Polje = najPolje(susedni[i], mapaDist, mapa, true, false);
                mapaDist.set(kljuc, dobijDist(tr,mapaDist,true)+1);
                if(dobijDist(tr,mapaDist,true)+1 < 1000) praviD++;
                qu.push(susedni[i]);
                duz++;
                // console.log(br + " " + duz);
            }
        }
    }
    
    // console.log("Obisao polja u bfs:" + duz + " " + praviD + " " + praviM);
    return mapaDist;
}

function dobij_susedne_vazduh(tr: Polje): Polje[]{
    let niz: Polje[] = [];
    for(let i = 0; i < 6; i++){
        if(poljeUMapi(napraviPolje(tr.q + nextP[i][0], tr.r + nextP[i][1], tr.s + nextP[i][2],null,null)))
            niz.push(napraviPolje(tr.q + nextP[i][0], tr.r + nextP[i][1], tr.s + nextP[i][2], null, null));
    }
    return niz;
}

function bfsVazduh(nizPolja: Polje[]): Map<number, number>{
    let mapaDist: Map<number, number> = new Map<number, number>();
    let qu: Polje[] = nizPolja;
    let duz = qu.length;
    let br = 0;
    let praviD = 0;
    let praviM = 0;
    for(let i = 0; i < qu.length; i++)
        mapaDist.set(napraviHash(qu[i]),0);
    
        mapaDist.forEach((value: number, key: number) => {
            if(value != 0) praviM++;
        });
    while(br < duz) {
        let tr = qu[br++];
        let susedni: Polje[] = dobij_susedne_vazduh(tr);
        // console.log(JSON.stringify(susedni))
        for(let i = 0; i < susedni.length; i++) {
            let kljuc:number = napraviHash(susedni[i]);
            if(!mapaDist.has(kljuc))
            {
                // let closest: Polje = najPolje(susedni[i], mapaDist, mapa, true, false);
                mapaDist.set(kljuc, dobijDist(tr,mapaDist,true)+1);
                if(dobijDist(tr,mapaDist,true)+1 < 1000) praviD++;
                qu.push(susedni[i]);
                duz++;
                // console.log(br + " " + duz);
            }
        }
    }
    
    // console.log("Obisao polja u bfs:" + duz + " " + praviD + " " + praviM);
    return mapaDist;
}

function idi_pravo_ka_polju(tr: Polje, cilj: Polje, mapa: Map<number, ValueType>):Polje{
    let nizCilj: Polje[] = [];
    nizCilj[0] = cilj;
    let distMapa: Map<number, number> = bfs(nizCilj, mapa);
    let polje: Polje = najPolje(tr, distMapa, mapa, true, false);
    // console.log("distanca" + dobijDist(polje, distMapa, true))
    return polje;
}

function vratiZastavu(response):Polje{
    return response.currFlag;
}

function listaVidljivihPolja(response):Polje[]{
    const mapa:Map<number,ValueType> = new Map<number,ValueType>();
    const listaPolja: Polje[] = response.map.tiles.flat();
    const samoVidljiva: Polje[] = listaPolja.filter(cur => Object.keys(cur).length !== 0);
    return samoVidljiva;
}

function idi_ka_zastavi(tr: Polje, mapa: Map<number, ValueType>): Polje{
    let nizPolja: Polje[] = bfsKopno(zastava,mapa);
    // console.log("Odavde krece bfs");
    // console.log(JSON.stringify(nizPolja));
    let distMapa: Map<number, number> = bfs(nizPolja, mapa);
    let polje: Polje = najPolje(tr, distMapa, mapa, true, false);
    // console.log("!!!!!!distanca gore");
    // console.log("distanca" + dobijDist(polje, distMapa, true))
    return polje;
    return idi_pravo_ka_polju(tr, zastava, mapa);
}

function su_susedi(polje1: Polje,polje2: Polje):boolean{
    var deltaQ = polje1.q - polje2.q;
    var deltaR = polje1.r - polje2.r;
    var deltaS = polje1.s - polje2.s;
    if (deltaQ == 0 && deltaS== 1 && deltaR == -1) {
        return true;
    }
    else if (deltaQ == -1 && deltaS == 1 && deltaR == 0) {
        return true;
    }
    else if (deltaQ == -1 && deltaS == 0 && deltaR == 1) {
        return true;
    }
    else if (deltaQ == 0 && deltaS == -1 && deltaR == 1) {
        return true;
    }
    else if (deltaQ == 1 && deltaS == -1 && deltaR == 0) {
        return true;
    }
    else if (deltaQ == 1 && deltaS == 0 && deltaR == -1) {
        return true;
    }
    return false;
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
    nizCilj.push(tr);
    let distMapa: Map<number, number> = bfs(nizCilj, mapa);
    let najbliza: Polje = null;
    let dist = 100;
    for(let i = 0; i < prodavnice.length; i++){
        let dzoker = dobij_susedne(prodavnice[i],mapa,false);
        for(let j = 0; j < dzoker.length; j++){
            if(dobijDist(dzoker[j], distMapa, true) < dist){
                najbliza = dzoker[j];
                dist = dobijDist(dzoker[j], distMapa, true);
            }
        }
    }
    return idi_pravo_ka_polju(tr, najbliza, mapa);
}

function scanForEnemies(res) :Avatar[] {
    const otherPlayers:Avatar[]=[];
    if(res.player1 && res.player1.id!=MY_ID && res.player1.health > 0){
        otherPlayers.push(createAvatar(res.player1));

    }
    if(res.player2 && res.player2.id!=MY_ID && res.player2.health > 0){
        otherPlayers.push(createAvatar(res.player2));

    }
    if(res.player3 && res.player3.id!=MY_ID && res.player3.health > 0){
        otherPlayers.push(createAvatar(res.player3));

    }
    if(res.player4 &&  res.player4.id!=MY_ID && res.player4.health > 0){
        otherPlayers.push(createAvatar(res.player4));

    }
    if(res.npc1 && res.npc1.health > 0){
        otherPlayers.push(createAvatar(res.npc1));
    }
    if(res.npc2 && res.npc2.health > 0){
        otherPlayers.push(createAvatar(res.npc2));
    }
    return otherPlayers;
}
function createAvatar(player):Avatar{
    const avatar:Avatar={
        id: player.id,
        health: player._health,
        maxHealth: player._maxHealth,
        money: player.money,
        q: player.q,
        r: player.r,
        s: player.s,
        cannons: player.cannons,
        paralysed: player.paralysed,
        whirlPoolDuration: player.whirlPoolDuration,
        potNums: player.potNums,
        illegalMoves: player.illegalMoves,
        sight: player.sight,
    }
    return avatar;
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

// zastava = napraviPolje(-1,-2,3,null, null);
// let p1: Polje = napraviPolje(0,0,0,null, "ISLAND");
// // let p2: Polje = napraviPolje(1,-1,0,null, "ISLAND");
// // let p3: Polje = napraviPolje(1,0,-1,null, "ISLAND");
// // let p4: Polje = napraviPolje(1,1,-2,null, "ISLAND");
// // let p5: Polje = napraviPolje(0,2,-2,null, "ISLAND");
// let mapa : Map<number, ValueType> = new Map<number, ValueType>();
//  mapa.set(napraviHash(p1), getValueType(p1))
// // mapa.set(napraviHash(p2), getValueType(p2))
// // mapa.set(napraviHash(p3), getValueType(p3))
// // mapa.set(napraviHash(p4), getValueType(p4))
// // mapa.set(napraviHash(p5), getValueType(p5))
// function testMetoda(){
//     let igrac:Polje = napraviPolje(1,2,-3,null,null)
//     // let meta = napraviPolje(0,3,-3,null,null)
//     while(napraviHash(igrac) != napraviHash(zastava))
//     {
//         let sl:Polje = idi_ka_zastavi(igrac, mapa);
//         console.log(getDirection(sl,igrac));
//         igrac = sl
//         console.log("q:"+sl.q+" r:" + sl.r + " s:"+ sl.s)
//     }
// }

// testMetoda()
// let mapa: Map<KeyType,boolean> = new Map<KeyType,boolean>();
// mapa.set(getKeyType(napraviPolje(-2,-2,0, null, null)), true);
// if(!mapa.has(getKeyType(napraviPolje(-2,-2,0, null, null))))
//     console.log("jebem ti mamu")
// let igrac:Polje = napraviPolje(0,-3,3,null,null)
// let meta = napraviPolje(0,3,-3,null,null)
// while(napraviHash(igrac) != napraviHash(meta))
// {
//     let sl:Polje = idi_pravo_ka_polju(igrac, meta, new Map<number, ValueType>())
//     igrac = sl
//     console.log("q:"+sl.q+" r:" + sl.r + " s:"+ sl.s)
// }

function getDirection(target, current):string {
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

export function getDirectionMain(target): string{
    // console.log(target,igrac);
    return getDirection(target, igrac);
}
