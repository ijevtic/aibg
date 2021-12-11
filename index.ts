import fetch from 'node-fetch';
import { updateGlobal, idiKaZastaviMain, getDirectionMain } from './methods';
import { Polje } from './types';

const SERVER_IP = 'best1.aibg.best:9080';
const MY_ID = 11;
const GAME_ID = 89;




const main = async () => {
    const inicijalnoStanje = await fetch(`http://${SERVER_IP}/train?gameId=${MY_ID}${GAME_ID}&playerId=${MY_ID}&position=${1}`)
        .then(res => res.json());
    updateGlobal(inicijalnoStanje);
    console.log("krenulo");
    for (let i = 0; i < 1250; i++) {
        const poljeGdeIdemo: Polje = idiKaZastaviMain();
        const gdeIdemo:string = getDirectionMain(poljeGdeIdemo);
        const drugi = await fetch(`http://${SERVER_IP}/doAction?playerId=${MY_ID}&gameId=${MY_ID}${GAME_ID}&action=${gdeIdemo}`)
            .then(res => res.json())
            .catch(err => {null});
        if(drugi == null){
            continue;
        }
        // console.log(drugi);
        updateGlobal(drugi)
    }
}

main();
