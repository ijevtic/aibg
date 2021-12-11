"use strict";
exports.__esModule = true;
exports.mapaVidljivihPolja = void 0;
var types_1 = require("./types");
var zastava = null;
var prodavnice = [];
function poljeUMapi(tr) {
    return Math.abs(tr.q) <= 14
        && Math.abs(tr.r) <= 14
        && Math.abs(tr.s) <= 14;
}
function poljeUMapiKoor(q, r, s) {
    return poljeUMapi(napraviPolje(q, r, s, null, null));
}
function getKeyType(tr) {
    var ret;
    ret.q = tr.q;
    ret.r = tr.r;
    ret.s = tr.s;
    return ret;
}
function prohodnoPolje(tr, mapa) {
    if (!poljeUMapi(tr))
        return false;
    var kljuc = getKeyType(tr);
    if (!mapa.has(kljuc))
        return true;
    return mapa.get(kljuc).entity == null;
}
function napraviPolje(q, r, s, entity, tileType) {
    var polje = { q: q, r: r, s: s, entity: entity, tileType: tileType };
    return polje;
}
function probajSusedni(q, r, s, mapa) {
    var polje = napraviPolje(q, r, s, null, null);
    return prohodnoPolje(polje, mapa);
}
function dobij_susedne(tr, mapa) {
    var niz = [];
    for (var i = 0; i < 6; i++)
        if (probajSusedni(tr.q + types_1.nextP[i][0], tr.r + types_1.nextP[i][1], tr.s + types_1.nextP[i][2], mapa))
            niz.push(napraviPolje(tr.q + types_1.nextP[i][0], tr.r + types_1.nextP[i][1], tr.s + types_1.nextP[i][2], null, null));
    return niz;
}
function najPolje(tr, mapaDist, mapa, najblize) {
    var susedni = dobij_susedne(tr, mapa);
    var res = null;
    var best = 0;
    if (najblize)
        best = 10000;
    for (var i = 0; i < susedni.length; i++) {
        var kljuc = getKeyType(susedni[i]);
        if ((najblize && mapaDist.has(kljuc) && mapaDist.get(kljuc) < best) ||
            ((!najblize && mapaDist.has(kljuc) && mapaDist.get(kljuc) > best)))
            if (mapaDist.has(kljuc) && mapaDist.get(kljuc) < best) {
                best = mapaDist.get(kljuc);
                res = susedni[i];
            }
    }
    return res;
}
function dobijDist(tr, mapaDist) {
    if (tr == null || !mapaDist.has(getKeyType(tr)))
        return 10000;
    return mapaDist.get(getKeyType(tr));
}
function bfs(poc, mapa) {
    var mapaDist = new Map();
    var qu = [];
    var br = 0;
    qu.push(poc);
    mapaDist.set(getKeyType(poc), 0);
    while (br < qu.length) {
        br++;
        var tr = qu[br];
        var susedni = dobij_susedne(tr, mapa);
        for (var i = 0; i < susedni.length; i++) {
            var kljuc = getKeyType(susedni[i]);
            if (!mapaDist.get(kljuc) && prohodnoPolje(susedni[i], mapa)) {
                var closest = najPolje(susedni[i], mapaDist, mapa, true);
                mapaDist.set(kljuc, dobijDist(closest, mapaDist) + 1);
                qu[br++] = susedni[i];
            }
        }
    }
    return mapaDist;
}
function idi_pravo_ka_polju(tr, cilj, mapa) {
    var distMapa = bfs(cilj, mapa);
    return najPolje(tr, distMapa, mapa, true);
}
function vratiZastavu(response) {
    return response.currFlag;
}
function mapaVidljivihPolja(response) {
    var mapa = new Map();
    var listaPolja = response.map.tiles.flat();
    var samoVidljiva = listaPolja.filter(function (cur) { return Object.keys(cur).length !== 0; });
    samoVidljiva.forEach(function (element) {
        var q = element.q, r = element.r, s = element.s, entity = element.entity, tileType = element.tileType;
        var kljuc = { q: q, r: r, s: s };
        var vrednost = { entity: entity, tileType: tileType };
        mapa.set(kljuc, vrednost);
    });
    return mapa;
}
exports.mapaVidljivihPolja = mapaVidljivihPolja;
function idi_ka_zastavi(tr, mapa) {
    return idi_pravo_ka_polju(tr, zastava, mapa);
}
function bezi_od_polja(tr, ne_cilj, mapa) {
    var distMapa = bfs(ne_cilj, mapa);
    return najPolje(tr, distMapa, mapa, false);
}
function najbliza_prodavnica(tr, mapa) {
    var distMapa = bfs(tr, mapa);
    var najbliza = null;
    var dist = 100;
    for (var i = 0; i < prodavnice.length; i++) {
        if (dobijDist(prodavnice[i], distMapa) < dist) {
            najbliza = prodavnice[i];
            dist = dobijDist(prodavnice[i], distMapa);
        }
    }
    return idi_pravo_ka_polju(tr, najbliza, mapa);
}
function getKeyTypeKoor(q, r, s) {
    var k;
    k.q = q;
    k.r = r;
    k.s = s;
    return k;
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
            mapa.set(getKeyTypeKoor(-7, -7, 14), napraviPolje(-7, -7, 14, null, "NORMAL"));
            break;
        case 2:
            mapa.set(getKeyTypeKoor(14, -7, -7), napraviPolje(14, -7, -7, null, "NORMAL"));
            break;
        case 3:
            mapa.set(getKeyTypeKoor(7, 7, -14), napraviPolje(7, 7, 1 - 4, null, "NORMAL"));
            break;
        case 4:
            mapa.set(getKeyTypeKoor(-14, -14, 7), napraviPolje(-14, 7, 7, null, "NORMAL"));
            break;
    }
}
function getDirection(target, current) {
    var deltaQ = target.q - current.q;
    var deltaR = target.r - current.r;
    var deltaS = target.s - current.s;
    if (deltaQ == 0 && deltaR == 1 && deltaS == -1) {
        return "nw";
    }
    else if (deltaQ == -1 && deltaR == 1 && deltaS == 0) {
        return "w";
    }
    else if (deltaQ == -1 && deltaR == 0 && deltaS == 1) {
        return "sw";
    }
    else if (deltaQ == 0 && deltaR == -1 && deltaS == 1) {
        return "se";
    }
    else if (deltaQ == 1 && deltaR == -1 && deltaS == 0) {
        return "e";
    }
    else if (deltaQ == 1 && deltaR == 0 && deltaS == -1) {
        return "ne";
    }
    console.log("NEVALIDNA KOORDINATA!!!!!");
    return "";
}
// function generateNextMove(tr: Polje, mapa: Map<KeyType, ValueType>): Polje{
// }
// let igrac = napraviPolje(-2,0,2,null,null)
// let meta = napraviPolje(2,-2,0,null,null)
// let sl = idi_pravo_ka_polju(igrac, meta, new Map<KeyType, ValueType>())
// console.log("q:"+sl.q+" r:" + sl.r + " s:"+ sl.s)
