import fetch from 'node-fetch';

const SERVER_IP = 'best2.aibg.best:9080';
const MY_ID = 11;
const GAME_ID = 1;

fetch(`http://${SERVER_IP}/train?gameId=${MY_ID}${GAME_ID}&playerId=${MY_ID}&position=${1}`)
    .then(res => res.json())
    .then(res => {
        console.log(res);
    });

