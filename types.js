"use strict";
exports.__esModule = true;
exports.Avatar = exports.nextP = void 0;
exports.nextP = [[-1, 1, 0], [1, -1, 0], [1, 0, -1], [-1, 0, 1], [0, 1, -1], [0, -1, 1]];
var Avatar = /** @class */ (function () {
    function Avatar(res) {
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
    return Avatar;
}());
exports.Avatar = Avatar;
