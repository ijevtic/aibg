import fetch from 'node-fetch';
import { updateGlobal, odlucivac, getDirectionMain, najblizaProdavnicaMain, idiKaZastaviMain , vratiIdNapada} from './methods';
import { Polje } from './types';

const SERVER_IP = 'best1.aibg.best:9080';
export const MY_ID: number = 11;
const GAME_ID = 136;




const main = async () => {
    const inicijalnoStanje = await fetch(`http://${SERVER_IP}/train?gameId=${MY_ID}${GAME_ID}&playerId=${MY_ID}&position=${1}`)
        .then(res => res.json());
    updateGlobal(inicijalnoStanje);
    console.log("IGRAJ I POBEDI PONOSNO SE VRATI");
    for (let i = 0; i < 1250; i++) {
        let poljeGdeIdemo: Polje = null;
        let gdeIdemo:string = null;
        let odluka=odlucivac()
        switch(odluka){
            case 1:
                poljeGdeIdemo = najblizaProdavnicaMain();
                gdeIdemo = getDirectionMain(poljeGdeIdemo);
                break;
            case 2:
                poljeGdeIdemo = idiKaZastaviMain();
                gdeIdemo = getDirectionMain(poljeGdeIdemo);
                break;
            case 3:
                gdeIdemo = "buy-HULL";
                break;
            case 4:
                gdeIdemo = "buy-CANNONS";
                break;
            case 5:
                gdeIdemo = "atk-"+vratiIdNapada();
                break;

        }
        const drugi = await fetch(`http://${SERVER_IP}/doAction?playerId=${MY_ID}&gameId=${MY_ID}${GAME_ID}&action=${gdeIdemo}`)
            .then(res => res.json())
            .catch(err => {null});
        if(drugi == null){
            continue;
        }
        updateGlobal(drugi)
    }
}

main();
