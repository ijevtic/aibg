"use strict";
exports.__esModule = true;
var node_fetch_1 = require("node-fetch");
var SERVER_IP = 'best2.aibg.best:9080';
var MY_ID = 11;
var GAME_ID = 1;
(0, node_fetch_1["default"])("http://".concat(SERVER_IP, "/train?gameId=").concat(MY_ID).concat(GAME_ID, "&playerId=").concat(MY_ID, "&position=").concat(1))
    .then(function (res) { return res.json(); })
    .then(function (res) {
    console.log(res);
});
