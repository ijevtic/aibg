"use strict";
exports.__esModule = true;
exports.mapaVidljivihPolja = void 0;
var types_1 = require("./types");
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
function najblizePolje(tr, mapaDist, mapa) {
    var susedni = dobij_susedne(tr, mapa);
    var res = null;
    var best = 10000;
    for (var i = 0; i < susedni.length; i++) {
        var kljuc = getKeyType(susedni[i]);
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
                var closest = najblizePolje(susedni[i], mapaDist, mapa);
                mapaDist.set(kljuc, dobijDist(closest, mapaDist) + 1);
                qu[br++] = susedni[i];
            }
        }
    }
    return mapaDist;
}
function idi_pravo_ka_polju(tr, cilj, mapa) {
    var distMapa = bfs(cilj, mapa);
    return najblizePolje(tr, distMapa, mapa);
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
