let frase = process.argv[2];

console.log(frase.replace(/ue/ig,'i').replace(/[aeiouáéíóú]/ig, 'i').toLowerCase());
