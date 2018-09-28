#!/usr/local/bin/node

let frase = process.argv[2];

frase = frase.split('').reverse().join('');


console.log(frase);
