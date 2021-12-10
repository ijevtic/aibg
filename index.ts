import fetch from 'node-fetch';
import {mapaVidljivihPolja} from "./methods"

const SERVER_IP = 'best2.aibg.best:9080';
const MY_ID = 11;
const GAME_ID = 17;


const main = async () => {
    const inicijalnoStanje = await fetch(`http://${SERVER_IP}/train?gameId=${MY_ID}${GAME_ID}&playerId=${MY_ID}&position=${1}`)
    .then(res => res.json());
    const mapa = mapaVidljivihPolja(inicijalnoStanje);
    console.log(mapa);
}

main();
