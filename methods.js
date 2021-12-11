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
    var q = tr.q, r = tr.r, s = tr.s;
    var ret = { q: q, r: r, s: s };
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
    for (var i = 0; i < 6; i++) {
        if (probajSusedni(tr.q + types_1.nextP[i][0], tr.r + types_1.nextP[i][1], tr.s + types_1.nextP[i][2], mapa))
            niz.push(napraviPolje(tr.q + types_1.nextP[i][0], tr.r + types_1.nextP[i][1], tr.s + types_1.nextP[i][2], null, null));
    }
    return niz;
}
function najPolje(tr, mapaDist, mapa, najblize) {
    var susedni = dobij_susedne(tr, mapa);
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
        if (napraviHash(susedni[i]) == napraviHash(napraviPolje(0, 3, -3, null, null))) {
            console.log("!!!!!!!!!!!!!!!!");
            console.log(best);
            console.log(dobijDist(napraviPolje(0, 3, -3, null, null), mapaDist, najblize));
        }
    }
    if (napraviHash(res) == napraviHash(napraviPolje(0, 3, -3, null, null)))
        console.log("???????");
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
function bfs(poc, mapa) {
    var mapaDist = new Map();
    var qu = [];
    var br = 0;
    qu.push(poc);
    var duz = 1;
    mapaDist.set(napraviHash(poc), 0);
    while (br < duz) {
        var tr = qu[br++];
        var susedni = dobij_susedne(tr, mapa);
        // console.log(JSON.stringify(susedni))
        for (var i = 0; i < susedni.length; i++) {
            var kljuc = napraviHash(susedni[i]);
            if (!mapaDist.has(kljuc) && prohodnoPolje(susedni[i], mapa)) {
                if (napraviHash(susedni[i]) == napraviHash(poc)) {
                    console.log("............................");
                }
                var closest = najPolje(susedni[i], mapaDist, mapa, true);
                mapaDist.set(kljuc, dobijDist(closest, mapaDist, true) + 1);
                qu[duz++] = susedni[i];
                // console.log(br + " " + duz);
            }
        }
    }
    return mapaDist;
}
function idi_pravo_ka_polju(tr, cilj, mapa) {
    var distMapa = bfs(cilj, mapa);
    var polje = najPolje(tr, distMapa, mapa, true);
    console.log("distanca" + dobijDist(polje, distMapa, true));
    return polje;
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
        var kljuc = napraviHash({ q: q, r: r, s: s, entity: entity, tileType: tileType });
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
    var polje = najPolje(tr, distMapa, mapa, false);
    // console.log("distanca" + dobijDist(polje, distMapa))
    return polje;
}
function najbliza_prodavnica(tr, mapa) {
    var distMapa = bfs(tr, mapa);
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
function drawMap(mapaVidljivih, nasaMapa) {
    mapaVidljivih.forEach(function (element) {
        var q = element.q, r = element.r, s = element.s, entity = element.entity, tileType = element.tileType;
        var kljuc = napraviHash({ q: q, r: r, s: s, entity: entity, tileType: tileType });
        var vrednost = { entity: entity, tileType: tileType };
        if (!nasaMapa.has(kljuc)) {
            nasaMapa.set(kljuc, vrednost);
            drawFromSymmetry(element, nasaMapa);
        }
    });
}
function drawFromSymmetry(polje, nasaMapa) {
}
var igrac = napraviPolje(0, -3, 3, null, null);
var meta = napraviPolje(0, 3, -3, null, null);
while (napraviHash(igrac) != napraviHash(meta)) {
    var sl = idi_pravo_ka_polju(igrac, meta, new Map());
    igrac = sl;
    console.log("q:" + sl.q + " r:" + sl.r + " s:" + sl.s);
}
