import fetch from 'node-fetch';
import { updateGlobal, odlucivac, getDirectionMain, najblizaProdavnicaMain, idiKaZastaviMain , vratiIdNapada, idiHitnoNegde} from './methods';
import { Polje } from './types';

const SERVER_IP = 'best1.aibg.best:9080';
export const MY_ID: number = 4;
const GAME_ID = 10001;



const main = async () => {
    // const milutinovic=await fetch(`http://${SERVER_IP}/admin/createGame?gameId=${GAME_ID}&playerOne=1&playerTwo=2&playerThree=3&playerFour=4&mapName=`);
    const inicijalnoStanje = await fetch(`http://${SERVER_IP}/game/play?playerId=${MY_ID}&gameId=${GAME_ID}`)
                                        .then(async res=>{
                                            const c=await res.json();
                                            return c;
                                        } );
     
    updateGlobal(inicijalnoStanje);
    console.log("IGRAJ I POBEDI PONOSNO SE VRATI");
    for (let i = 0; i < 1250; i++) {
        let poljeGdeIdemo: Polje = null;
        let gdeIdemo:string = null;
        let odluka=odlucivac()
        console.log("usli u switch");
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
            case 6:
                poljeGdeIdemo = idiHitnoNegde();
                gdeIdemo = getDirectionMain(poljeGdeIdemo);
                break;

        }
        console.log("izasli iz switch");
        const drugi = await fetch(`http://${SERVER_IP}/doAction?playerId=${MY_ID}&gameId=${GAME_ID}&action=${gdeIdemo}`)
            .then(async res => {
                const c=await res.json();
                return c;
            })
        if(drugi == null){
            continue;
        }
        updateGlobal(drugi)
    }
}

main();