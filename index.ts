import fetch from 'node-fetch'

fetch('https://elephant-api.herokuapp.com/elephants')
    .then(res => res.json())
    .then(res => {
        console.log(res);
    });

