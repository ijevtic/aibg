"use strict";
exports.__esModule = true;
var node_fetch_1 = require("node-fetch");
(0, node_fetch_1["default"])('https://elephant-api.herokuapp.com/elephants')
    .then(function (res) { return res.json(); })
    .then(function (res) {
    console.log(res);
});
