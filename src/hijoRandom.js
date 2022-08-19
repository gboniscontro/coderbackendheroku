function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}
let cant = process.argv[2] ?? 100000000
console.log(cant)
let result = [];

console.log(getRandomInt(1000))
for (let i = 0; i < cant; i++) {
    const r = parseInt(getRandomInt(1000))
    if (result[r] > 0)
        result[r] += 1
    else
        result[r] = 1

}
//hay que pasarlo a un objeto para devolverlo la forma mas simple es usar spread y encerrarlo entre llaves de objeto o se puede usar el reduce

let objRandom = { ...result }

/*
objRandom = result.slice(1).reduce(function (obj, v) {

    obj[i] = v;

    i++;

    return obj;

}, {});*/

process.send(JSON.stringify(objRandom))