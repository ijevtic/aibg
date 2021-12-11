import fetch from 'node-fetch';
import { mapaVidljivihPolja } from "./methods"

const SERVER_IP = 'best1.aibg.best:9080';
const MY_ID = 11;
const GAME_ID = 31;




const main = async () => {
    const inicijalnoStanje = await fetch(`http://${SERVER_IP}/train?gameId=${MY_ID}${GAME_ID}&playerId=${MY_ID}&position=${1}`)
        .then(res => res.json());
    const mapa = mapaVidljivihPolja(inicijalnoStanje);
    for (let i = 0; i < 20; i++) {
        const drugi = await fetch(`http://${SERVER_IP}/doAction?playerId=${MY_ID}&gameId=${MY_ID}${GAME_ID}&action=${"se"}`)
            .then(res => res.json());
        console.log(drugi);
    }
}

main();
