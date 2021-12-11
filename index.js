"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MY_ID = void 0;
var node_fetch_1 = require("node-fetch");
var methods_1 = require("./methods");
var SERVER_IP = 'best1.aibg.best:9080';
exports.MY_ID = 11;
var GAME_ID = 118;
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var inicijalnoStanje, i, poljeGdeIdemo, gdeIdemo, drugi;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, node_fetch_1["default"])("http://".concat(SERVER_IP, "/train?gameId=").concat(exports.MY_ID).concat(GAME_ID, "&playerId=").concat(exports.MY_ID, "&position=").concat(1))
                    .then(function (res) { return res.json(); })];
            case 1:
                inicijalnoStanje = _a.sent();
                (0, methods_1.updateGlobal)(inicijalnoStanje);
                console.log("IGRAJ I POBEDI PONOSNO SE VRATI");
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < 1250)) return [3 /*break*/, 5];
                poljeGdeIdemo = null;
                gdeIdemo = null;
                switch ((0, methods_1.odlucivac)()) {
                    case 1:
                        poljeGdeIdemo = (0, methods_1.najblizaProdavnicaMain)();
                        gdeIdemo = (0, methods_1.getDirectionMain)(poljeGdeIdemo);
                        break;
                    case 2:
                        poljeGdeIdemo = (0, methods_1.idiKaZastaviMain)();
                        gdeIdemo = (0, methods_1.getDirectionMain)(poljeGdeIdemo);
                        break;
                    case 3:
                        gdeIdemo = "buy-HULL";
                        break;
                    case 4:
                        gdeIdemo = "buy-CANNONS";
                        break;
                }
                return [4 /*yield*/, (0, node_fetch_1["default"])("http://".concat(SERVER_IP, "/doAction?playerId=").concat(exports.MY_ID, "&gameId=").concat(exports.MY_ID).concat(GAME_ID, "&action=").concat(gdeIdemo))
                        .then(function (res) { return res.json(); })["catch"](function (err) { null; })];
            case 3:
                drugi = _a.sent();
                if (drugi == null) {
                    return [3 /*break*/, 4];
                }
                // console.log(drugi);
                (0, methods_1.updateGlobal)(drugi);
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
main();
