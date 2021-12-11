"use strict";
exports.__esModule = true;
exports.getDirectionMain = exports.idiKaZastaviMain = exports.updateGlobal = void 0;
var types_1 = require("./types");
var zastava = null;
var prodavnice = [];
var globalnaMapa = new Map();
var igrac = null;
var cnt = 0;
function updateGlobal(response) {
    zastava = response.currFlag;
    // console.log(zastava);
    var vidljivaPolja = listaVidljivihPolja(response);
    var filtriranaVidljiva = vidljivaPolja.filter(function (cur) { return true; });
    // globalnaMapa = new Map<number, ValueType>();
    filtriranaVidljiva.forEach(function (element) {
        if (globalnaMapa.has(napraviHash(element))) {
            globalnaMapa["delete"](napraviHash(element));
        }
        globalnaMapa.set(napraviHash(element), getValueType(element));
    });
    console.log("!!!!!!!!");
    console.log(JSON.stringify(globalnaMapa));
    igrac = napraviPolje(response.player1.q, response.player1.r, response.player1.s, null, null);
}
exports.updateGlobal = updateGlobal;
function idiKaZastaviMain() {
    return idi_ka_zastavi(igrac, globalnaMapa);
}
exports.idiKaZastaviMain = idiKaZastaviMain;
function poljeUMapi(tr) {
    return Math.abs(tr.q) <= 14
        && Math.abs(tr.r) <= 14
        && Math.abs(tr.s) <= 14;
}
function poljeUMapiKoor(q, r, s) {
    return poljeUMapi(napraviPolje(q, r, s, null, null));
}
function getKeyType(tr) {
    var q = tr.q, r = tr.r, s = tr.s;
    var ret = { q: q, r: r, s: s };
    return ret;
}
function getValueType(tr) {
    var entity = tr.entity, tileType = tr.tileType;
    var ret = { entity: entity, tileType: tileType };
    return ret;
}
function napraviHash(tr) {
    return tr.q * 100000 + tr.r * 1000 + tr.s;
}
function prohodnoPolje(tr, mapa) {
    if (!poljeUMapi(tr))
        return false;
    var kljuc = napraviHash(tr);
    if (!mapa.has(kljuc))
        return true;
    return mapa.get(kljuc).entity == null;
}
function kopnoPolje(tr, mapa) {
    if (!poljeUMapi(tr))
        return false;
    var kljuc = napraviHash(tr);
    if (!mapa.has(kljuc))
        return false;
    return mapa.get(kljuc).tileType == "ISLAND";
}
function napraviPolje(q, r, s, entity, tileType) {
    var polje = { q: q, r: r, s: s, entity: entity, tileType: tileType };
    return polje;
}
function probajSusedni(q, r, s, mapa, kopno) {
    var polje = napraviPolje(q, r, s, null, null);
    if (kopno)
        return kopnoPolje(polje, mapa);
    return prohodnoPolje(polje, mapa);
}
function dobij_susedne(tr, mapa, kopno) {
    var niz = [];
    for (var i = 0; i < 6; i++) {
        if (probajSusedni(tr.q + types_1.nextP[i][0], tr.r + types_1.nextP[i][1], tr.s + types_1.nextP[i][2], mapa, kopno))
            niz.push(napraviPolje(tr.q + types_1.nextP[i][0], tr.r + types_1.nextP[i][1], tr.s + types_1.nextP[i][2], null, null));
    }
    return niz;
}
function najPolje(tr, mapaDist, mapa, najblize, kopno) {
    var susedni = dobij_susedne(tr, mapa, kopno);
    var res = null;
    var best = -1;
    if (najblize)
        best = 10000;
    // console.log("trenutno polje" + JSON.stringify(tr));
    // console.log("ide lista susednih");
    // console.log(JSON.stringify(susedni));
    for (var i = 0; i < susedni.length; i++) {
        var kljuc = napraviHash(susedni[i]);
        if ((najblize && dobijDist(susedni[i], mapaDist, najblize) < best) ||
            ((!najblize && dobijDist(susedni[i], mapaDist, najblize) > best))) {
            best = dobijDist(susedni[i], mapaDist, najblize);
            res = susedni[i];
        }
    }
    // console.log(best);
    return res;
}
function dobijDist(tr, mapaDist, najblize) {
    if (tr == null || !mapaDist.has(napraviHash(tr))) {
        if (najblize)
            return 1000;
        return -1000;
    }
    return mapaDist.get(napraviHash(tr));
}
function bfsKopno(poc, mapa) {
    var mapaDist = new Map();
    var d = 0;
    var qu = [];
    var br = 0;
    qu.push(poc);
    var duz = 1;
    mapaDist.set(napraviHash(poc), 0);
    while (br < duz) {
        var tr = qu[br++];
        var susedni = dobij_susedne(tr, mapa, true);
        for (var i = 0; i < susedni.length; i++) {
            var kljuc = napraviHash(susedni[i]);
            if (!mapaDist.has(kljuc) && kopnoPolje(susedni[i], mapa)) {
                qu.push(susedni[i]);
                duz++;
                mapaDist.set(kljuc, 0);
            }
        }
    }
    return qu;
}
function bfs(nizPolja, mapa) {
    var mapaDist = new Map();
    var qu = nizPolja;
    var duz = qu.length;
    var br = 0;
    var praviD = 0;
    var praviM = 0;
    for (var i = 0; i < qu.length; i++)
        mapaDist.set(napraviHash(qu[i]), 0);
    mapaDist.forEach(function (value, key) {
        if (value != 0)
            praviM++;
    });
    while (br < duz) {
        var tr = qu[br++];
        var susedni = dobij_susedne(tr, mapa, false);
        // console.log(JSON.stringify(susedni))
        for (var i = 0; i < susedni.length; i++) {
            var kljuc = napraviHash(susedni[i]);
            if (!mapaDist.has(kljuc) && prohodnoPolje(susedni[i], mapa)) {
                // let closest: Polje = najPolje(susedni[i], mapaDist, mapa, true, false);
                mapaDist.set(kljuc, dobijDist(tr, mapaDist, true) + 1);
                if (dobijDist(tr, mapaDist, true) + 1 < 1000)
                    praviD++;
                qu.push(susedni[i]);
                duz++;
                // console.log(br + " " + duz);
            }
        }
    }
    console.log("Obisao polja u bfs:" + duz + " " + praviD + " " + praviM);
    return mapaDist;
}
function idi_pravo_ka_polju(tr, cilj, mapa) {
    var nizCilj = [];
    nizCilj[0] = cilj;
    var distMapa = bfs(nizCilj, mapa);
    var polje = najPolje(tr, distMapa, mapa, true, false);
    // console.log("distanca" + dobijDist(polje, distMapa, true))
    return polje;
}
function vratiZastavu(response) {
    return response.currFlag;
}
function listaVidljivihPolja(response) {
    var mapa = new Map();
    var listaPolja = response.map.tiles.flat();
    var samoVidljiva = listaPolja.filter(function (cur) { return Object.keys(cur).length !== 0; });
    return samoVidljiva;
}
function idi_ka_zastavi(tr, mapa) {
    var nizPolja = bfsKopno(zastava, mapa);
    console.log("Odavde krece bfs");
    console.log(JSON.stringify(nizPolja));
    var distMapa = bfs(nizPolja, mapa);
    var polje = najPolje(tr, distMapa, mapa, true, false);
    console.log("!!!!!!distanca gore");
    // console.log("distanca" + dobijDist(polje, distMapa, true))
    return polje;
    return idi_pravo_ka_polju(tr, zastava, mapa);
}
function bezi_od_polja(tr, ne_cilj, mapa) {
    var nizCilj = [];
    nizCilj[0] = ne_cilj;
    var distMapa = bfs(nizCilj, mapa);
    var polje = najPolje(tr, distMapa, mapa, false, false);
    // console.log("distanca" + dobijDist(polje, distMapa))
    return polje;
}
function najbliza_prodavnica(tr, mapa) {
    var nizCilj = [];
    nizCilj[0] = tr;
    var distMapa = bfs(nizCilj, mapa);
    var najbliza = null;
    var dist = 100;
    for (var i = 0; i < prodavnice.length; i++) {
        if (dobijDist(prodavnice[i], distMapa, true) < dist) {
            najbliza = prodavnice[i];
            dist = dobijDist(prodavnice[i], distMapa, true);
        }
    }
    return idi_pravo_ka_polju(tr, najbliza, mapa);
}
function scanForEnemies(otherPlayers, npcs, res) {
    if (res.player1) {
        otherPlayers.push(new types_1.Avatar(res.player1));
    }
    if (res.player2) {
        otherPlayers.push(new types_1.Avatar(res.player2));
    }
    if (res.player3) {
        otherPlayers.push(new types_1.Avatar(res.player3));
    }
    if (res.player4) {
        otherPlayers.push(new types_1.Avatar(res.player4));
    }
    if (res.npc1) {
        npcs.push(new types_1.Avatar(res.npc1));
    }
    if (res.npc2) {
        npcs.push(new types_1.Avatar(res.npc2));
    }
}
function initStartPostion(res, mapa) {
    switch (res.id) {
        case 1:
            mapa.set(napraviHash(napraviPolje(-7, -7, 14, null, "NORMAL")), napraviPolje(-7, -7, 14, null, "NORMAL"));
            break;
        case 2:
            mapa.set(napraviHash(napraviPolje(14, -7, -7, null, "NORMAL")), napraviPolje(14, -7, -7, null, "NORMAL"));
            break;
        case 3:
            mapa.set(napraviHash(napraviPolje(7, 7, -14, null, "NORMAL")), napraviPolje(7, 7, -14, null, "NORMAL"));
            break;
        case 4:
            mapa.set(napraviHash(napraviPolje(-14, 7, 7, null, "NORMAL")), napraviPolje(-14, 7, 7, null, "NORMAL"));
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
function drawFromSymmetry(polje, nasaMapa) {
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
function getDirection(target, current) {
    var deltaQ = target.q - current.q;
    var deltaR = target.r - current.r;
    var deltaS = target.s - current.s;
    if (deltaQ == 0 && deltaS == 1 && deltaR == -1) {
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
function getDirectionMain(target) {
    // console.log(target,igrac);
    return getDirection(target, igrac);
}
exports.getDirectionMain = getDirectionMain;
