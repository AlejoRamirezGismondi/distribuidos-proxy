const express = require('express')
const app = express()
const {promisify} = require('util');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

app.use(cors())
const authHost = '10.102.197.244'
const geoHost = '10.102.197.112'
const productHost = '10.102.197.112' //NOT THE ONE
const port = 8080
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
}

function promisifyAll(client) {
    const to = {};
    for (var k in client) {
        if (typeof client[k] != 'function') continue;
        to[k] = promisify(client[k].bind(client));
    }
    return to;
}

const authDefinition = protoLoader.loadSync( __dirname + '/protobuf/auth.proto', options);
const authObject = grpc.loadPackageDefinition(authDefinition);
const authClient = promisifyAll(new authObject.AuthService(`${authHost}:${port}`, grpc.credentials.createInsecure()))

const geoDefinition = protoLoader.loadSync( __dirname + '/protobuf/geo.proto', options);
const geoObject = grpc.loadPackageDefinition(geoDefinition);
const geoClient = promisifyAll(new geoObject.GeoService(`${geoHost}:${port}`, grpc.credentials.createInsecure()))

const productDefinition = protoLoader.loadSync( __dirname + '/protobuf/product.proto', options);
const productObject = grpc.loadPackageDefinition(productDefinition);
const productClient = promisifyAll(new productObject.GeoService(`${productHost}:${port}`, grpc.credentials.createInsecure()))

app.get('/authService', (req, res) => {
    res.send(authClient.authenticate({mail: req.mail, password: req.password}))
})

app.get('/geoService', (req, res) => {
    res.send(geoClient.getCountryCityByIP({ip: req}))
})

app.get('/product', (req, res) => {
    res.send(productClient.getProducts({}))
})

app.get('/', (req, res) => {
    res.send('/')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

